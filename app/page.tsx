"use client";

import * as React from "react";
import { EditorPanel } from "../components/EditorPanel";
import { PreviewPanel } from "../components/PreviewPanel";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { defaultTemplate } from "../lib/defaultTemplate";
import { fillGanjiNames } from "../lib/ganji";
import type { Report } from "../lib/schema";
import { validateReport } from "../lib/schema";

const STORAGE_KEY = "saju_report_draft";

function cloneReport(report: Report): Report {
  return JSON.parse(JSON.stringify(report)) as Report;
}

function getLineColumn(text: string, position: number) {
  let line = 1;
  let column = 1;
  for (let i = 0; i < position; i += 1) {
    if (text[i] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column };
}

function safeParseJson(text: string) {
  try {
    return { ok: true as const, data: JSON.parse(text) };
  } catch (error) {
    if (error instanceof SyntaxError) {
      const match = error.message.match(/position (\d+)/i);
      if (match) {
        const pos = Number(match[1]);
        const { line, column } = getLineColumn(text, pos);
        return {
          ok: false as const,
          error: `JSON 파싱 오류 (line ${line}, column ${column})`
        };
      }
      return { ok: false as const, error: "JSON 파싱 오류" };
    }
    return { ok: false as const, error: "알 수 없는 오류" };
  }
}

export default function Home() {
  const [report, setReport] = React.useState<Report>(() =>
    cloneReport(defaultTemplate)
  );
  const [rawJson, setRawJson] = React.useState(
    JSON.stringify(defaultTemplate, null, 2)
  );
  const [isJsonDirty, setIsJsonDirty] = React.useState(false);
  const [parseError, setParseError] = React.useState<string | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState("data");
  const [isFormattingAnalysis, setIsFormattingAnalysis] = React.useState(false);
  const [formatError, setFormatError] = React.useState<string | null>(null);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [publishError, setPublishError] = React.useState<string | null>(null);
  const [publishUrl, setPublishUrl] = React.useState<string | null>(null);
  const canPublish =
    !isJsonDirty && !parseError && validationErrors.length === 0;

  React.useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = safeParseJson(stored);
      if (parsed.ok) {
        const validation = validateReport(parsed.data as Report);
        if (validation.ok) {
          const nextReport = fillGanjiNames(parsed.data as Report);
          setReport(nextReport);
          setRawJson(JSON.stringify(nextReport, null, 2));
          setIsJsonDirty(false);
          return;
        }
      }
    }
    setReport(cloneReport(defaultTemplate));
    setRawJson(JSON.stringify(defaultTemplate, null, 2));
    setIsJsonDirty(false);
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
    }, 400);
    return () => clearTimeout(timer);
  }, [report]);

  React.useEffect(() => {
    if (!isJsonDirty) {
      setRawJson(JSON.stringify(report, null, 2));
    }
  }, [report, isJsonDirty]);

  const handleRawJsonChange = (value: string) => {
    setRawJson(value);
    setIsJsonDirty(true);
    setParseError(null);
    setValidationErrors([]);
  };

  const handleTemplateLoad = () => {
    setRawJson(JSON.stringify(defaultTemplate, null, 2));
    setIsJsonDirty(true);
    setParseError(null);
    setValidationErrors([]);
  };

  const handleValidate = async () => {
    setParseError(null);
    setValidationErrors([]);
    const parsed = safeParseJson(rawJson);
    if (!parsed.ok) {
      setParseError(parsed.error);
      return;
    }
    let nextReport = fillGanjiNames(parsed.data as Report);
    try {
      const response = await fetch("/api/augment-pillars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report: nextReport })
      });
      if (response.ok) {
        const payload = (await response.json()) as { report?: Report };
        if (payload.report) {
          nextReport = payload.report;
        }
      } else {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setParseError(`자동 채움 실패: ${payload?.error ?? "API 오류"}`);
      }
    } catch (error) {
      setParseError(
        `자동 채움 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`
      );
    }

    const validation = validateReport(nextReport);
    if (!validation.ok) {
      setValidationErrors(validation.errors);
      return;
    }

    setReport(nextReport);
    setIsJsonDirty(false);
    setRawJson(JSON.stringify(nextReport, null, 2));
  };

  const handleFormat = () => {
    setParseError(null);
    const parsed = safeParseJson(rawJson);
    if (!parsed.ok) {
      setParseError(parsed.error);
      return;
    }
    setRawJson(JSON.stringify(parsed.data, null, 2));
    setIsJsonDirty(true);
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const parsed = safeParseJson(text);
      if (!parsed.ok) {
        setParseError(parsed.error);
        setValidationErrors([]);
        setRawJson(text);
        setIsJsonDirty(true);
        return;
      }
      const validation = validateReport(parsed.data as Report);
      if (!validation.ok) {
        setValidationErrors(validation.errors);
        setParseError(null);
        setRawJson(JSON.stringify(parsed.data, null, 2));
        setIsJsonDirty(true);
        return;
      }
      const nextReport = fillGanjiNames(parsed.data as Report);
      setReport(nextReport);
      setRawJson(JSON.stringify(nextReport, null, 2));
      setIsJsonDirty(false);
      setParseError(null);
      setValidationErrors([]);
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateTexts = (texts: Report["texts"]) => {
    setReport((prev) => ({ ...prev, texts }));
  };

  const updateDayMasterAnalysis = (value: string) => {
    setReport((prev) => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        part1: {
          ...prev.dashboard.part1,
          dayMasterAnalysis: value
        }
      }
    }));
  };

  const updateDayPillarAnalysis = (value: string) => {
    setReport((prev) => ({
      ...prev,
      dashboard: {
        ...prev.dashboard,
        part1: {
          ...prev.dashboard.part1,
          dayPillarAnalysis: value
        }
      }
    }));
  };

  const handleFormatAnalysis = async () => {
    setFormatError(null);
    setIsFormattingAnalysis(true);
    try {
      const response = await fetch("/api/format-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setFormatError(payload?.error ?? "자동 정리 실패");
        return;
      }

      const payload = (await response.json()) as { report?: Report };
      if (payload.report) {
        setReport(payload.report);
      }
    } catch (error) {
      setFormatError(
        error instanceof Error ? error.message : "자동 정리 실패"
      );
    } finally {
      setIsFormattingAnalysis(false);
    }
  };

  const updateAnnual = (annual: Report["annual"]) => {
    setReport((prev) => ({ ...prev, annual }));
  };

  const updateTheme = (theme: Report["theme"]) => {
    setReport((prev) => ({ ...prev, theme }));
  };

  const handlePrint = () => {
    setActiveTab("preview");
    window.setTimeout(() => {
      window.print();
    }, 100);
  };

  const handlePublish = async () => {
    if (!canPublish) {
      setPublishError("먼저 Validate를 완료한 뒤 Publish 해주세요.");
      return;
    }
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET;
    if (!adminSecret) {
      setPublishError("NEXT_PUBLIC_ADMIN_SECRET이 설정되지 않았습니다.");
      return;
    }

    setPublishError(null);
    setIsPublishing(true);
    try {
      const response = await fetch("/api/reports/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret
        },
        body: JSON.stringify({ report })
      });

      const payload = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok) {
        setPublishError(payload.error ?? "Publish 실패");
        return;
      }

      setPublishUrl(payload.url ?? null);
      setActiveTab("preview");
    } catch (error) {
      setPublishError(
        error instanceof Error ? error.message : "Publish 실패"
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyLink = async () => {
    if (!publishUrl) return;
    const absoluteUrl = new URL(publishUrl, window.location.origin).toString();
    await navigator.clipboard.writeText(absoluteUrl);
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-6 lg:px-10">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between print-hidden">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Saju Report Builder
          </p>
          <h1 className="font-display text-2xl font-semibold text-neutral-900">
            사주 리포트 대시보드 빌더
          </h1>
          <p className="text-sm text-neutral-500">
            JSON + 원문 텍스트를 입력하고 디자인을 즉시 미리보기 합니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handlePublish}
            disabled={isPublishing || !canPublish}
          >
            {isPublishing ? "Publish 중..." : "Publish"}
          </Button>
          <Button size="sm" variant="outline" onClick={handlePrint}>
            PDF 출력
          </Button>
          <div className="rounded-full border border-neutral-200 bg-white/70 px-4 py-2 text-xs text-neutral-500">
            자동 저장: {STORAGE_KEY}
          </div>
        </div>
      </header>

      {(publishUrl || publishError) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          {publishUrl && (
            <>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                공유 링크 생성됨
              </span>
              <span className="font-mono text-xs">{publishUrl}</span>
              <Button size="sm" variant="ghost" onClick={handleCopyLink}>
                Copy link
              </Button>
            </>
          )}
          {publishError && (
            <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">
              {publishError}
            </span>
          )}
        </div>
      )}

      <div className="mt-6 hidden gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto pr-2 scrollbar-thin print-hidden">
          <EditorPanel
            rawJson={rawJson}
            isJsonDirty={isJsonDirty}
            onRawJsonChange={handleRawJsonChange}
            onTemplateLoad={handleTemplateLoad}
            onValidate={handleValidate}
            onFormat={handleFormat}
            onImportFile={handleImportFile}
            onExport={handleExport}
            parseError={parseError}
            validationErrors={validationErrors}
            dayMasterAnalysis={report.dashboard.part1.dayMasterAnalysis ?? ""}
            onDayMasterAnalysisChange={updateDayMasterAnalysis}
            dayPillarAnalysis={report.dashboard.part1.dayPillarAnalysis ?? ""}
            onDayPillarAnalysisChange={updateDayPillarAnalysis}
            onFormatAnalysis={handleFormatAnalysis}
            isFormattingAnalysis={isFormattingAnalysis}
            formatError={formatError}
            parts={report.texts}
            onPartsChange={updateTexts}
            annual={report.annual}
            onAnnualChange={updateAnnual}
          />
        </div>
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto pr-2 scrollbar-thin print-full">
          <PreviewPanel report={report} />
        </div>
      </div>

      <div className="mt-6 lg:hidden print-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="data">데이터</TabsTrigger>
            <TabsTrigger value="preview">미리보기</TabsTrigger>
          </TabsList>
          <TabsContent value="data">
            <EditorPanel
              rawJson={rawJson}
              isJsonDirty={isJsonDirty}
              onRawJsonChange={handleRawJsonChange}
              onTemplateLoad={handleTemplateLoad}
              onValidate={handleValidate}
              onFormat={handleFormat}
              onImportFile={handleImportFile}
              onExport={handleExport}
              parseError={parseError}
              validationErrors={validationErrors}
              dayMasterAnalysis={report.dashboard.part1.dayMasterAnalysis ?? ""}
              onDayMasterAnalysisChange={updateDayMasterAnalysis}
              dayPillarAnalysis={report.dashboard.part1.dayPillarAnalysis ?? ""}
              onDayPillarAnalysisChange={updateDayPillarAnalysis}
              onFormatAnalysis={handleFormatAnalysis}
              isFormattingAnalysis={isFormattingAnalysis}
              formatError={formatError}
              parts={report.texts}
              onPartsChange={updateTexts}
              annual={report.annual}
              onAnnualChange={updateAnnual}
            />
          </TabsContent>
          <TabsContent value="preview">
            <PreviewPanel report={report} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
