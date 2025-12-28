"use client";

import * as React from "react";
import type { Report } from "../lib/schema";
import { SummaryCards } from "./preview/SummaryCards";
import { PillarsTable } from "./preview/PillarsTable";
import { FiveElementsChart } from "./preview/FiveElementsChart";
import { YongsinTable } from "./preview/YongsinTable";
import { TextPartsView } from "./preview/TextPartsView";
import { AnnualFortuneView } from "./preview/AnnualFortuneView";

interface PreviewPanelProps {
  report: Report;
}

const shadowMap: Record<string, string> = {
  none: "none",
  soft: "0 10px 30px rgba(0, 0, 0, 0.08)",
  medium: "0 16px 40px rgba(0, 0, 0, 0.16)"
};

export function PreviewPanel({ report }: PreviewPanelProps) {
  const theme = report.theme;
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: theme.ui.cardRadius,
    boxShadow: shadowMap[theme.ui.cardShadow] ?? shadowMap.soft
  };

  const sectionGap = theme.ui.sectionSpacing === "compact" ? 16 : 28;

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: theme.typography.baseFontSize,
    fontFamily:
      theme.typography.fontFamily === "serif"
        ? "var(--font-display)"
        : "var(--font-body)",
    lineHeight: 1.7
  };

  const headingStyle: React.CSSProperties = {
    fontSize: `${1.2 * theme.typography.headingScale}em`
  };

  const subHeadingStyle: React.CSSProperties = {
    fontSize: `${1.05 * theme.typography.headingScale}em`
  };

  const innerStyle: React.CSSProperties = {
    maxWidth:
      theme.layout.previewWidthMode === "reader"
        ? theme.layout.readerMaxWidth
        : undefined,
    width: "100%",
    margin: "0 auto"
  };

  const a4Style: React.CSSProperties = theme.layout.a4Mode
    ? {
        maxWidth: 820,
        minHeight: 1160,
        margin: "0 auto",
        boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
        borderRadius: theme.ui.cardRadius
      }
    : {};

  return (
    <div className="rounded-3xl border border-neutral-200/60 bg-white/40 p-4">
      <div
        style={{ ...containerStyle, ...a4Style, borderColor: theme.colors.border }}
        className="rounded-3xl border px-6 py-8"
      >
        <div style={{ ...innerStyle, gap: sectionGap }} className="flex flex-col">
          <div style={{ ...cardStyle }} className="border px-6 py-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.2em]"
                    style={{ color: theme.colors.mutedText }}
                  >
                    Saju Report
                  </p>
                  <h1 className="mt-2 font-display font-semibold" style={headingStyle}>
                    {report.reportMeta.title}
                  </h1>
                  <p className="text-sm" style={{ color: theme.colors.mutedText }}>
                    {report.subject.name}
                    {report.subject.gender ? ` · ${report.subject.gender}` : ""} · {report.reportMeta.createdAt}
                  </p>
                </div>
                <p className="text-xs" style={{ color: theme.colors.mutedText }}>
                  리포트 ID: {report.reportMeta.reportId}
                </p>
              </div>
              <div
                className="rounded-2xl border px-4 py-3 text-sm"
                style={{
                  borderColor: theme.colors.border,
                  backgroundColor: `${theme.colors.accent}15`
                }}
              >
                {report.dashboard.part0.oneLineSummary}
              </div>
              <div className="flex flex-wrap gap-2">
                {(report.dashboard.part0.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-3 py-1 text-xs"
                    style={{
                      backgroundColor: `${theme.colors.accent}22`,
                      color: theme.colors.accent
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {report.dashboard.part0.alerts?.length > 0 && (
                <div className="text-xs" style={{ color: theme.colors.mutedText }}>
                  {report.dashboard.part0.alerts.map((alert) => (
                    <p key={alert}>• {alert}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={cardStyle} className="border px-6 py-6">
            <p className="text-sm font-semibold" style={subHeadingStyle}>
              대상 정보
            </p>
            <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="text-xs" style={{ color: theme.colors.mutedText }}>
                  출생 정보
                </p>
                <p>
                  {report.subject.birth?.calendar ?? "-"} · {report.subject.birth?.date ?? "-"} · {report.subject.birth?.time ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: theme.colors.mutedText }}>
                  나이
                </p>
                <p>
                  한국나이 {report.subject.age?.koreanAge ?? "-"} · 만 {report.subject.age?.internationalAge ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: theme.colors.mutedText }}>
                  용신
                </p>
                <p>{(report.subject as Record<string, string>).yongsin ?? "-"}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: theme.colors.mutedText }}>
                  출처
                </p>
                <p>{report.reportMeta.source}</p>
              </div>
            </div>
          </div>

          <SummaryCards
            cards={report.dashboard.part1.summaryCards}
            cardStyle={cardStyle}
            accentColor={theme.colors.accent}
            textColor={theme.colors.text}
            mutedText={theme.colors.mutedText}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <PillarsTable
              table={report.dashboard.part1.pillars.table}
              hiddenStems={report.dashboard.part1.pillars.hiddenStems}
              cardStyle={cardStyle}
              borderColor={theme.colors.border}
              textColor={theme.colors.text}
              mutedText={theme.colors.mutedText}
              accentColor={theme.colors.accent}
            />
            <FiveElementsChart
              ratio={report.dashboard.part1.fiveElements.ratio}
              counts={report.dashboard.part1.fiveElements.counts}
              accentColor={theme.colors.accent}
              textColor={theme.colors.text}
              mutedText={theme.colors.mutedText}
              cardStyle={cardStyle}
            />
          </div>

          <div style={cardStyle} className="border px-6 py-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs" style={{ color: theme.colors.mutedText }}>
                  강약
                </p>
                <p className="text-sm font-semibold">
                  {report.dashboard.part1.strength?.label ?? "-"}
                </p>
                <p className="text-xs" style={{ color: theme.colors.mutedText }}>
                  {report.dashboard.part1.strength?.basis?.join(" · ") ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: theme.colors.mutedText }}>
                  구조
                </p>
                <p className="text-sm font-semibold">
                  {report.dashboard.part1.structure?.gyeokguk ?? "-"}
                </p>
                <p className="text-xs" style={{ color: theme.colors.mutedText }}>
                  {report.dashboard.part1.structure?.note ?? "-"}
                </p>
              </div>
            </div>
          </div>

          <div style={cardStyle} className="border px-6 py-6">
            <p className="mb-2 text-sm font-semibold" style={{ color: theme.colors.text }}>
              일간 분석
            </p>
            {report.dashboard.part1.dayMasterHighlights?.length ? (
              <div className="mb-3 space-y-2">
                {report.dashboard.part1.dayMasterHighlights.map((text) => (
                  <p
                    key={text}
                    className="text-lg font-semibold"
                    style={{ color: theme.colors.accent }}
                  >
                    {text}
                  </p>
                ))}
              </div>
            ) : null}
            {report.dashboard.part1.dayMasterKeywords?.length ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {report.dashboard.part1.dayMasterKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full px-3 py-1 text-xs"
                    style={{
                      backgroundColor: `${theme.colors.accent}22`,
                      color: theme.colors.accent
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="whitespace-pre-wrap text-sm leading-6">
              {report.dashboard.part1.dayMasterAnalysis || "(내용이 비어 있습니다)"}
            </div>
          </div>

          <div style={cardStyle} className="border px-6 py-6">
            <p className="mb-2 text-sm font-semibold" style={{ color: theme.colors.text }}>
              일주 분석
            </p>
            {report.dashboard.part1.dayPillarHighlights?.length ? (
              <div className="mb-3 space-y-2">
                {report.dashboard.part1.dayPillarHighlights.map((text) => (
                  <p
                    key={text}
                    className="text-lg font-semibold"
                    style={{ color: theme.colors.accent }}
                  >
                    {text}
                  </p>
                ))}
              </div>
            ) : null}
            {report.dashboard.part1.dayPillarKeywords?.length ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {report.dashboard.part1.dayPillarKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full px-3 py-1 text-xs"
                    style={{
                      backgroundColor: `${theme.colors.accent}22`,
                      color: theme.colors.accent
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="whitespace-pre-wrap text-sm leading-6">
              {report.dashboard.part1.dayPillarAnalysis || "(내용이 비어 있습니다)"}
            </div>
          </div>

          <YongsinTable
            yongsin={report.dashboard.part1.yongsin}
            cardStyle={cardStyle}
            borderColor={theme.colors.border}
            textColor={theme.colors.text}
            mutedText={theme.colors.mutedText}
            accentColor={theme.colors.accent}
          />

          <div style={{ display: "grid", gap: sectionGap }}>
            <div>
              <p className="mb-3 text-sm font-semibold" style={subHeadingStyle}>
                Part2+ 원문
              </p>
              <TextPartsView
                parts={report.texts}
                cardStyle={cardStyle}
                textColor={theme.colors.text}
                accentColor={theme.colors.accent}
              />
            </div>
            <AnnualFortuneView
              annual={report.annual}
              cardStyle={cardStyle}
              textColor={theme.colors.text}
              accentColor={theme.colors.accent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
