import * as React from "react";
import type { AnnualFortune, TextPart } from "../lib/schema";
import { AnnualFortuneEditor } from "./parts/AnnualFortuneEditor";
import { TextPartsEditor } from "./parts/TextPartsEditor";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface EditorPanelProps {
  rawJson: string;
  isJsonDirty: boolean;
  onRawJsonChange: (value: string) => void;
  onTemplateLoad: () => void;
  onValidate: () => void;
  onFormat: () => void;
  onImportFile: (file: File) => void;
  onExport: () => void;
  parseError?: string | null;
  validationErrors: string[];
  dayMasterAnalysis: string;
  onDayMasterAnalysisChange: (value: string) => void;
  dayPillarAnalysis: string;
  onDayPillarAnalysisChange: (value: string) => void;
  onFormatAnalysis: () => void;
  isFormattingAnalysis: boolean;
  formatError?: string | null;
  parts: TextPart[];
  onPartsChange: (parts: TextPart[]) => void;
  annual: AnnualFortune;
  onAnnualChange: (annual: AnnualFortune) => void;
}

export function EditorPanel({
  rawJson,
  isJsonDirty,
  onRawJsonChange,
  onTemplateLoad,
  onValidate,
  onFormat,
  onImportFile,
  onExport,
  parseError,
  validationErrors,
  dayMasterAnalysis,
  onDayMasterAnalysisChange,
  dayPillarAnalysis,
  onDayPillarAnalysisChange,
  onFormatAnalysis,
  isFormattingAnalysis,
  formatError,
  parts,
  onPartsChange,
  annual,
  onAnnualChange
}: EditorPanelProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportFile(file);
    }
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Part0~1 JSON 데이터</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>rawJson</Label>
            {isJsonDirty && (
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                아직 적용되지 않음
              </span>
            )}
          </div>
          <Textarea
            className="min-h-[220px] font-mono text-xs"
            value={rawJson}
            onChange={(event) => onRawJsonChange(event.target.value)}
          />

          {(parseError || validationErrors.length > 0) && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <p className="mb-1 font-semibold">검증 실패</p>
              {parseError && <p>{parseError}</p>}
              {validationErrors.map((error) => (
                <p key={error}>• {error}</p>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={onTemplateLoad}>
              Template Load
            </Button>
            <Button size="sm" variant="secondary" onClick={onValidate}>
              Validate
            </Button>
            <Button size="sm" variant="ghost" onClick={onFormat}>
              Format
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Import
            </Button>
            <Button size="sm" variant="outline" onClick={onExport}>
              Export
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>일간/일주 분석 입력</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-neutral-500">
              AI 전체 정리: 일간/일주 + Part2 원문 + 신년운세 전체에 적용됩니다.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={onFormatAnalysis}
              disabled={isFormattingAnalysis}
            >
              {isFormattingAnalysis ? "정리 중..." : "AI 전체 정리"}
            </Button>
          </div>
          {formatError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {formatError}
            </div>
          )}
          <div className="space-y-1">
            <Label>일간 분석</Label>
            <Textarea
              className="min-h-[180px] resize-y"
              placeholder="일간 분석 내용을 입력하세요"
              value={dayMasterAnalysis}
              onChange={(event) => onDayMasterAnalysisChange(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>일주 분석</Label>
            <Textarea
              className="min-h-[180px] resize-y"
              placeholder="일주 분석 내용을 입력하세요"
              value={dayPillarAnalysis}
              onChange={(event) => onDayPillarAnalysisChange(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Part2+ 텍스트 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <TextPartsEditor parts={parts} onChange={onPartsChange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2026 신년운세 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <AnnualFortuneEditor annual={annual} onChange={onAnnualChange} />
        </CardContent>
      </Card>
    </div>
  );
}
