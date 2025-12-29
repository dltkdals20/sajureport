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
  const baseFontSize = Math.max(theme.typography.baseFontSize, 16);
  const consultUrl = report.reportMeta.consultUrl?.trim();
  const canConsult = Boolean(consultUrl);
  const dayMasterHighlights = report.dashboard.part1.dayMasterHighlights ?? [];
  const dayMasterHighlightItems = dayMasterHighlights.slice(0, 3);
  const dayPillarHighlights = report.dashboard.part1.dayPillarHighlights ?? [];
  const dayPillarHighlightItems = dayPillarHighlights.slice(0, 3);
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
    fontSize: baseFontSize,
    fontFamily:
      theme.typography.fontFamily === "serif"
        ? "var(--font-display)"
        : "var(--font-body)",
    lineHeight: 1.8
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

  const handleConsultClick = () => {
    if (!consultUrl) return;
    window.open(consultUrl, "_blank", "noopener,noreferrer");
  };

  const consultButtonStyle: React.CSSProperties = {
    backgroundColor: canConsult ? theme.colors.accent : theme.colors.border,
    color: canConsult ? "#fff" : theme.colors.mutedText
  };

  const analysisCardStyle: React.CSSProperties = {
    ...cardStyle,
    backgroundColor: "var(--cardBg)",
    borderColor: "var(--border)"
  };

  const analysisColors = {
    title: "#2B2B2B",
    body: "#3A3A3A",
    muted: "#6B625A",
    accent: "#C65A2E"
  };

  return (
    <div className="rounded-3xl border border-neutral-200/60 bg-white/40 p-3 sm:p-4">
      <div
        style={{ ...containerStyle, ...a4Style, borderColor: theme.colors.border }}
        className="rounded-3xl border px-3 py-4 sm:px-6 sm:py-8"
      >
        <div style={{ ...innerStyle, gap: sectionGap }} className="flex flex-col">
          <div style={{ ...cardStyle }} className="border px-3 py-4 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p
                    className="text-sm uppercase tracking-[0.2em]"
                    style={{ color: theme.colors.mutedText }}
                  >
                    Saju Report
                  </p>
                  <h1 className="mt-2 font-display font-semibold" style={headingStyle}>
                    {report.reportMeta.title}
                  </h1>
                  <p className="text-base" style={{ color: theme.colors.mutedText }}>
                    {report.subject.name}
                    {report.subject.gender ? ` · ${report.subject.gender}` : ""} · {report.reportMeta.createdAt}
                  </p>
                </div>
                <p className="text-sm" style={{ color: theme.colors.mutedText }}>
                  리포트 ID: {report.reportMeta.reportId}
                </p>
              </div>
              <div
                className="rounded-2xl border px-3 py-3 text-base leading-7 sm:px-4"
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
                    className="rounded-full px-3 py-1 text-sm"
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
                <div className="text-sm" style={{ color: theme.colors.mutedText }}>
                  {report.dashboard.part0.alerts.map((alert) => (
                    <p key={alert}>• {alert}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={cardStyle} className="border px-3 py-4 sm:px-6 sm:py-6">
            <p className="text-base font-semibold" style={subHeadingStyle}>
              대상 정보
            </p>
            <div className="mt-4 grid gap-3 text-base md:grid-cols-2">
              <div>
                <p className="text-sm" style={{ color: theme.colors.mutedText }}>
                  출생 정보
                </p>
                <p>
                  {report.subject.birth?.calendar ?? "-"} · {report.subject.birth?.date ?? "-"} · {report.subject.birth?.time ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.colors.mutedText }}>
                  나이
                </p>
                <p>
                  한국나이 {report.subject.age?.koreanAge ?? "-"} · 만 {report.subject.age?.internationalAge ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.colors.mutedText }}>
                  용신
                </p>
                <p>{(report.subject as Record<string, string>).yongsin ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.colors.mutedText }}>
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

          <div style={cardStyle} className="border px-3 py-4 sm:px-6 sm:py-6">
            <p className="mb-3 text-base font-semibold" style={{ color: theme.colors.text }}>
              상담 신청
            </p>
            <button
              type="button"
              onClick={handleConsultClick}
              disabled={!canConsult}
              className="w-full rounded-2xl px-6 py-4 text-base font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:hover:opacity-100 sm:text-lg"
              style={consultButtonStyle}
            >
              상담 신청하기
            </button>
            {!canConsult && (
              <p className="mt-2 text-sm" style={{ color: theme.colors.mutedText }}>
                reportMeta.consultUrl에 상담 링크를 넣어주세요.
              </p>
            )}
          </div>

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

          <div style={cardStyle} className="border px-3 py-4 sm:px-6 sm:py-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm" style={{ color: theme.colors.mutedText }}>
                  강약
                </p>
                <p className="text-base font-semibold">
                  {report.dashboard.part1.strength?.label ?? "-"}
                </p>
                <p className="text-sm" style={{ color: theme.colors.mutedText }}>
                  {report.dashboard.part1.strength?.basis?.join(" · ") ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: theme.colors.mutedText }}>
                  구조
                </p>
                <p className="text-base font-semibold">
                  {report.dashboard.part1.structure?.gyeokguk ?? "-"}
                </p>
                <p className="text-sm" style={{ color: theme.colors.mutedText }}>
                  {report.dashboard.part1.structure?.note ?? "-"}
                </p>
              </div>
            </div>
          </div>

          <div
            style={analysisCardStyle}
            className="analysis-card border px-3 py-4 sm:px-6 sm:py-6"
          >
            <p className="analysis-title mb-2">일간 분석</p>
            <div className="analysis-def mb-4 space-y-1">
              <p>
                일간은 ‘나’ 자체를 뜻하는 핵심 값이라, 타고난 기질과 에너지 방향(기본 성향)을 보여줘요.
              </p>
              <p>
                그래서 어떤 상황에서도 반복되는 내 반응 패턴과 강점을 이해하는 기준이 됩니다.
              </p>
            </div>
            {dayMasterHighlightItems.length ? (
              <div className="analysis-highlight">
                {dayMasterHighlightItems.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            ) : null}
            <div className="analysis-body whitespace-pre-wrap">
              {report.dashboard.part1.dayMasterAnalysis || "(내용이 비어 있습니다)"}
            </div>
            {report.dashboard.part1.dayMasterKeywords?.length ? (
              <div className="analysis-chips">
                {report.dashboard.part1.dayMasterKeywords.map((keyword) => (
                  <span key={keyword} className="analysis-chip">
                    {keyword}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div
            style={analysisCardStyle}
            className="analysis-card border px-3 py-4 sm:px-6 sm:py-6"
          >
            <p className="analysis-title mb-2">일주 분석</p>
            <div className="analysis-def mb-4 space-y-1">
              <p>
                일주는 타고난 기질과 생활 습관이 만나는 지점이라, 개인의 성향을 아주 현실적으로 설명해줘요.
              </p>
              <p>그래서 성격 테스트보다 더 “정확하게 체감된다”는 반응이 자주 나옵니다.</p>
            </div>
            {dayPillarHighlightItems.length ? (
              <div className="analysis-highlight">
                {dayPillarHighlightItems.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            ) : null}
            <div className="analysis-body whitespace-pre-wrap">
              {report.dashboard.part1.dayPillarAnalysis || "(내용이 비어 있습니다)"}
            </div>
            {report.dashboard.part1.dayPillarKeywords?.length ? (
              <div className="analysis-chips">
                {report.dashboard.part1.dayPillarKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="analysis-chip"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <YongsinTable
            yongsin={report.dashboard.part1.yongsin}
            cardStyle={analysisCardStyle}
            borderColor="var(--border)"
            className="analysis-card"
          />

          <div style={{ display: "grid", gap: sectionGap }}>
            <div>
              <p className="mb-3 text-base font-semibold" style={subHeadingStyle}>
                Part2+ 원문
              </p>
              <TextPartsView
                parts={report.texts}
                cardStyle={analysisCardStyle}
                textColor={analysisColors.body}
              />
            </div>
            <AnnualFortuneView
              annual={report.annual}
              cardStyle={analysisCardStyle}
              textColor={analysisColors.body}
            />
            <div style={cardStyle} className="border px-3 py-4 sm:px-6 sm:py-6">
              <p className="mb-3 text-base font-semibold" style={{ color: theme.colors.text }}>
                상담 신청
              </p>
              <button
                type="button"
                onClick={handleConsultClick}
                disabled={!canConsult}
                className="w-full rounded-2xl px-6 py-4 text-base font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:hover:opacity-100 sm:text-lg"
                style={consultButtonStyle}
              >
                상담 신청하기
              </button>
              {!canConsult && (
                <p className="mt-2 text-sm" style={{ color: theme.colors.mutedText }}>
                  reportMeta.consultUrl에 상담 링크를 넣어주세요.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
