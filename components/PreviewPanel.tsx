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

// 천간별 물상 정보
const heavenlyStemInfo: Record<string, { korean: string; yinyang: string; image: string; keywords: string[] }> = {
  "甲": {
    korean: "갑목",
    yinyang: "양목",
    image: "굵고 큰 나무(거목)",
    keywords: ["개척", "직진", "큰그림", "솔선수범", "책임감"]
  },
  "乙": {
    korean: "을목",
    yinyang: "음목",
    image: "화초/잡초/넝쿨, 꽃봉오리·잎",
    keywords: ["유연함", "생활력", "적응", "센스", "꾸준함"]
  },
  "丙": {
    korean: "병화",
    yinyang: "양화",
    image: "태양, 빛, 전기",
    keywords: ["존재감", "낙천", "열정", "확산", "의리/정의감"]
  },
  "丁": {
    korean: "정화",
    yinyang: "음화",
    image: "촛불·등불, 달빛, 난롯불",
    keywords: ["섬세함", "배려", "집중", "기민함", "감정기복"]
  },
  "戊": {
    korean: "무토",
    yinyang: "양토",
    image: "산, 황량한 바위산·황무지",
    keywords: ["버팀목", "묵직함", "지구력", "고집", "포용"]
  },
  "己": {
    korean: "기토",
    yinyang: "음토",
    image: "넓은 들판, 밭/정원(문전옥답)",
    keywords: ["안정", "돌봄", "인내", "속마음", "실속"]
  },
  "庚": {
    korean: "경금",
    yinyang: "양금",
    image: "큰 바위, 강철(제련 전 원석 느낌)",
    keywords: ["결단", "직설", "원칙", "강단", "현실판단"]
  },
  "辛": {
    korean: "신금",
    yinyang: "음금",
    image: "보석, 칼·바늘, 제련된 금속",
    keywords: ["정교함", "깔끔함", "기준높음", "예민함", "품위"]
  },
  "壬": {
    korean: "임수",
    yinyang: "양수",
    image: "바다·큰 강·호수, 큰 물(시원)",
    keywords: ["스케일", "정보력", "유연전략", "임기응변", "수집/기획"]
  },
  "癸": {
    korean: "계수",
    yinyang: "음수",
    image: "시냇물·비·지하수(응축된 물)",
    keywords: ["조용한 힘", "관찰", "아이디어", "촉", "은근한 지속"]
  }
};

// 일주(日柱) 정보
const dayPillarInfo: Record<string, { korean: string; archetype: string; keywords: string[] }> = {
  "갑자": { korean: "갑자", archetype: "원칙파 탐구러", keywords: ["호기심", "원칙", "독립성", "개척", "유연성"] },
  "을축": { korean: "을축", archetype: "꾸준 완주러", keywords: ["인내", "끈기", "성실", "내면주관", "실리"] },
  "병인": { korean: "병인", archetype: "햇살 직진러", keywords: ["낙관", "에너지", "추진", "존재감", "신중"] },
  "정묘": { korean: "정묘", archetype: "감각 몰입러", keywords: ["집중", "섬세", "매력", "관계감각", "도전심"] },
  "무진": { korean: "무진", archetype: "통큰 배포러", keywords: ["너그러움", "카리스마", "배포", "의리", "한방"] },
  "기사": { korean: "기사", archetype: "친절 실속러", keywords: ["호기심", "배려", "목표집중", "끈질김", "현실감"] },
  "경오": { korean: "경오", archetype: "유쾌 돌격러", keywords: ["직진", "결단", "추진", "유머", "균형"] },
  "신미": { korean: "신미", archetype: "세련 마무리러", keywords: ["미감", "예리함", "디테일", "품격", "마무리"] },
  "임신": { korean: "임신", archetype: "눈치 빠른 변화러", keywords: ["순발력", "호기심", "적응", "매력", "낙관"] },
  "계유": { korean: "계유", archetype: "깔끔 기준러", keywords: ["예민함", "주관", "개성", "기준", "피로누적"] },
  "갑술": { korean: "갑술", archetype: "넉살 좋은 단단이", keywords: ["인간미", "기개", "목적의식", "책임", "신뢰"] },
  "을해": { korean: "을해", archetype: "감성 유연러", keywords: ["감수성", "유연", "변화수용", "자기서사", "자유"] },
  "병자": { korean: "병자", archetype: "반전 감정러", keywords: ["관대함", "이중성", "감정진폭", "매력", "자기수용"] },
  "정축": { korean: "정축", archetype: "버티는 근성러", keywords: ["생존력", "인내", "집중", "성실", "회복"] },
  "무인": { korean: "무인", archetype: "진심 직진러", keywords: ["진정성", "용기", "책임", "정직", "강단"] },
  "기묘": { korean: "기묘", archetype: "다정 돌봄러", keywords: ["따뜻함", "헌신", "배려", "관계회복", "상처성장"] },
  "경진": { korean: "경진", archetype: "예측불가 변주러", keywords: ["의외성", "즉흥", "제어욕", "창의", "변덕"] },
  "신사": { korean: "신사", archetype: "차분한 불꽃러", keywords: ["겉냉정", "속정", "복합감정", "매력", "깊이"] },
  "임오": { korean: "임오", archetype: "사람 끌림러", keywords: ["친화력", "조화", "매력", "추진", "관계확장"] },
  "계미": { korean: "계미", archetype: "혼돈 정리러", keywords: ["실험정신", "질서부여", "창의", "예측불가", "기대감"] },
  "갑신": { korean: "갑신", archetype: "든든 버팀러", keywords: ["책임", "보호본능", "단단함", "인내", "냉유머"] },
  "을유": { korean: "을유", archetype: "까칠한 매력러", keywords: ["예민", "아름다움", "경계심", "자존감", "강한존재감"] },
  "병술": { korean: "병술", archetype: "잠재력 폭발러", keywords: ["잠재력", "열정", "영향력", "추진", "방향성"] },
  "정해": { korean: "정해", archetype: "포근 여유러", keywords: ["친절", "감성", "안정감", "공감", "느긋함"] },
  "무자": { korean: "무자", archetype: "속마음 숨김러", keywords: ["미스터리", "관찰", "자기보호", "깊이", "신중"] },
  "기축": { korean: "기축", archetype: "속단단 실리러", keywords: ["안정감", "자기기준", "묵묵함", "실리", "꾸준"] },
  "경인": { korean: "경인", archetype: "단칼 통찰러", keywords: ["결단", "관조", "냉정", "직감", "카리스마"] },
  "신묘": { korean: "신묘", archetype: "예민 센스러", keywords: ["감각", "예술성", "예리함", "기준", "자기관리"] },
  "임진": { korean: "임진", archetype: "겉엄격 속관대", keywords: ["자기엄격", "타인관대", "카리스마", "사람모음", "갈등관리"] },
  "계사": { korean: "계사", archetype: "분위기 조율러", keywords: ["신비감", "조율", "유연", "완충", "자연스러움"] },
  "갑오": { korean: "갑오", archetype: "영감 질주러", keywords: ["열정", "영감", "모험", "과감함", "소진주의"] },
  "을미": { korean: "을미", archetype: "근거있는 여유러", keywords: ["안정기반", "유연", "노련", "여유", "호감도"] },
  "병신": { korean: "병신", archetype: "감성 멋쟁이", keywords: ["미감", "에너지", "감수성", "순간가치", "관계소중"] },
  "정유": { korean: "정유", archetype: "디테일 취향러", keywords: ["정밀", "세련", "몰입", "완성도", "기준엄격"] },
  "무술": { korean: "무술", archetype: "속열정 묵직러", keywords: ["내면열정", "강렬함", "존재감", "의리", "증명욕"] },
  "기해": { korean: "기해", archetype: "평범 탈출러", keywords: ["독특함", "욕망포착", "솔직함", "변환능력", "인간미"] },
  "경자": { korean: "경자", archetype: "깊게 파는 몰입러", keywords: ["몰입", "집요", "잠재력", "내적압력", "성취욕"] },
  "신축": { korean: "신축", archetype: "엉뚱 실속러", keywords: ["창의", "순발력", "무마능력", "대담", "신중"] },
  "임인": { korean: "임인", archetype: "직관 돌파러", keywords: ["직관", "대범함", "도전", "무의식활용", "회복력"] },
  "계묘": { korean: "계묘", archetype: "깔끔 정돈러", keywords: ["꼼꼼", "정리정돈", "평화감", "자기영역", "신뢰"] },
  "갑진": { korean: "갑진", archetype: "큰그림 성장러", keywords: ["야망", "변화무쌍", "성장욕", "실행력", "욕망조절"] },
  "을사": { korean: "을사", archetype: "파도타는 재능러", keywords: ["재능", "명예욕", "시행착오", "성취", "일희일비주의"] },
  "병오": { korean: "병오", archetype: "확신 직진러", keywords: ["열정", "집중", "추진", "자신감", "돌파력"] },
  "정미": { korean: "정미", archetype: "세계관 몰입러", keywords: ["집요함", "몰입", "자기세계", "설득력", "완성추구"] },
  "무신": { korean: "무신", archetype: "혼자서 쌓는 축적러", keywords: ["고독", "축적", "기회창출", "인맥운", "성장기대"] },
  "기유": { korean: "기유", archetype: "소확행 챙김러", keywords: ["섬세", "나눔", "실용행복", "성실", "풍성함"] },
  "경술": { korean: "경술", archetype: "포스 숨김러", keywords: ["존재감", "절제", "단호함", "인식전환", "압도감"] },
  "신해": { korean: "신해", archetype: "차분 장인러", keywords: ["탁월함", "연마", "한단계씩", "가능성", "꾸준"] },
  "임자": { korean: "임자", archetype: "속깊은 관찰러", keywords: ["깊은내면", "복잡성", "조용함", "영향력", "응원형"] },
  "계축": { korean: "계축", archetype: "티 안 내는 강자", keywords: ["컨트롤", "긴장관리", "실수적음", "듬직함", "숨은한방"] },
  "갑인": { korean: "갑인", archetype: "불굴 근성러", keywords: ["의지", "몰입", "도전", "위험감수", "목표집착"] },
  "을묘": { korean: "을묘", archetype: "부드럽지만 단단러", keywords: ["겉부드러움", "타협없음", "효율우회", "적응력", "완수력"] },
  "병진": { korean: "병진", archetype: "과정 공유러", keywords: ["열정", "표현", "과정공유", "과장기질", "성취"] },
  "정사": { korean: "정사", archetype: "예측불가 매력러", keywords: ["정열", "즉흥", "관찰재미", "반전", "그럴듯한결과"] },
  "무오": { korean: "무오", archetype: "쿨한 다정러", keywords: ["포용력", "쿨함", "따뜻함", "완충", "안정감"] },
  "기미": { korean: "기미", archetype: "균형 맞추는 기준러", keywords: ["기준집착", "균형추구", "규칙창출", "모순감", "기반형"] },
  "경신": { korean: "경신", archetype: "단호한 선긋기러", keywords: ["결단력", "뚝심", "해결본능", "방어력", "자기확신"] },
  "신유": { korean: "신유", archetype: "까칠하지만 의리파", keywords: ["의리", "단단함", "매력", "상처감수", "속정"] },
  "임술": { korean: "임술", archetype: "큰일 정리러", keywords: ["흡수력", "종결능력", "파괴/재생", "축적", "세대전환"] },
  "계해": { korean: "계해", archetype: "혼돈에서 새판러", keywords: ["혼돈수용", "경계해체", "직관", "재창조", "선악회색지대"] }
};

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
            <div className="mb-4">
              <p className="analysis-title mb-4">일간 분석</p>
              {report.dashboard.part1.pillars.table.day && (
                <div className="mb-4 pb-4 border-b border-neutral-200">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-6xl font-bold" style={{ color: theme.colors.accent }}>
                        {report.dashboard.part1.pillars.table.day.stem}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="text-lg font-bold text-neutral-800">
                          {heavenlyStemInfo[report.dashboard.part1.pillars.table.day.stem]?.korean || report.dashboard.part1.pillars.table.day.stemName}
                        </p>
                        <p className="text-xs font-medium text-neutral-500 mt-0.5">
                          {heavenlyStemInfo[report.dashboard.part1.pillars.table.day.stem]?.yinyang || ""}
                        </p>
                      </div>
                      <p className="text-sm text-neutral-600 font-semibold">
                        {heavenlyStemInfo[report.dashboard.part1.pillars.table.day.stem]?.image || ""}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {heavenlyStemInfo[report.dashboard.part1.pillars.table.day.stem]?.keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="inline-block text-xs font-medium px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: `${theme.colors.accent}15`,
                              color: theme.colors.accent
                            }}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        십간십지: {report.dashboard.part1.pillars.table.day.tenGod}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="analysis-def mb-4 space-y-1">
              <p>
                일간은 '나' 자체를 뜻하는 핵심 값이라, 타고난 기질과 에너지 방향(기본 성향)을 보여줘요.
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
            <div className="mb-4">
              <p className="analysis-title mb-4">일주 분석</p>
              {report.dashboard.part1.pillars.table.day && (
                <div className="mb-4 pb-4 border-b border-neutral-200">
                  {(() => {
                    const dayPillarName = `${report.dashboard.part1.pillars.table.day.stem}${report.dashboard.part1.pillars.table.day.branch}`;
                    const pillarInfo = dayPillarInfo[dayPillarName];
                    
                    return (
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-5xl font-bold" style={{ color: theme.colors.accent }}>
                            {report.dashboard.part1.pillars.table.day.stem}
                            <span className="text-3xl">{report.dashboard.part1.pillars.table.day.branch}</span>
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div>
                            <p className="text-lg font-bold text-neutral-800">
                              {pillarInfo?.korean || `${report.dashboard.part1.pillars.table.day.name}`}
                            </p>
                            <p className="text-sm font-semibold text-neutral-600 mt-0.5">
                              {pillarInfo?.archetype || ""}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {pillarInfo?.keywords.map((keyword) => (
                              <span
                                key={keyword}
                                className="inline-block text-xs font-medium px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor: `${theme.colors.accent}15`,
                                  color: theme.colors.accent
                                }}
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            <div className="analysis-def mb-4 space-y-1">
              <p>
                일주는 타고난 기질과 생활 습관이 만나는 지점이라, 개인의 성향을 아주 현실적으로 설명해줘요.
              </p>
              <p>그래서 성격 테스트보다 더 "정확하게 체감된다"는 반응이 자주 나옵니다.</p>
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
