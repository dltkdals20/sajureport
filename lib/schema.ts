export type ThemePreset = "cream" | "white" | "dark";

export interface ThemeColors {
  background: string;
  card: string;
  border: string;
  accent: string;
  text: string;
  mutedText: string;
}

export interface ThemeTypography {
  baseFontSize: number;
  headingScale: number;
  fontFamily: "system" | "serif";
}

export interface ThemeUI {
  cardRadius: number;
  cardShadow: "none" | "soft" | "medium";
  sectionSpacing: "compact" | "comfortable";
}

export interface ThemeLayout {
  previewWidthMode: "reader" | "full";
  readerMaxWidth: number;
  a4Mode: boolean;
}

export interface ThemeConfig {
  preset: ThemePreset;
  colors: ThemeColors;
  typography: ThemeTypography;
  ui: ThemeUI;
  layout: ThemeLayout;
}

export interface ReportMeta {
  reportId: string;
  title: string;
  language: string;
  createdAt: string;
  templateVersion: string;
  author: string;
  source: string;
}

export interface SubjectInfo {
  name: string;
  gender?: string;
  birth?: Record<string, string | number | boolean | undefined>;
  age?: Record<string, string | number | boolean | undefined>;
  [key: string]: unknown;
}

export interface PillarCell {
  stem: string;
  branch: string;
  name?: string;
  tenGod?: string;
  stemName?: string;
  branchName?: string;
  stemTenGod?: string;
  branchTenGod?: string;
}

export interface PillarsTable {
  year: PillarCell;
  month: PillarCell;
  day: PillarCell;
  time: PillarCell;
}

export interface DashboardPart0 {
  oneLineSummary: string;
  tags: string[];
  alerts: string[];
}

export interface SummaryCard {
  title: string;
  value: string;
}

export interface FiveElements {
  counts: Record<string, number>;
  ratio: Record<string, number>;
  dominant: string;
  lacking: string[];
  note: string;
}

export interface StrengthInfo {
  type: string;
  label: string;
  confidence: string;
  basis: string[];
}

export interface StructureInfo {
  gyeokguk: string;
  keyTenGod: string;
  note: string;
}

export interface YongsinTableRow {
  element: string;
  type: string;
  comment: string;
}

export interface YongsinInfo {
  best: string[];
  good: string[];
  bad: string[];
  avoid: string[];
  table: YongsinTableRow[];
}

export interface DashboardPart1 {
  pillars: {
    table: PillarsTable;
    hiddenStems?: Record<string, string[]>;
  };
  fiveElements: FiveElements;
  dayMasterAnalysis?: string;
  dayMasterKeywords?: string[];
  dayMasterHighlights?: string[];
  strength: StrengthInfo;
  structure: StructureInfo;
  yongsin: YongsinInfo;
  dayPillarAnalysis?: string;
  dayPillarKeywords?: string[];
  dayPillarHighlights?: string[];
  summaryCards: SummaryCard[];
}

export interface TextPart {
  partId: string;
  title: string;
  format: "plain" | "markdown";
  body: string;
  keywords?: string[];
  highlights?: string[];
}

export interface AnnualSection {
  title: string;
  body: string;
  keywords?: string[];
  highlights?: string[];
}

export interface AnnualFortune {
  year: 2026;
  sections: {
    career: AnnualSection;
    business: AnnualSection;
    love: AnnualSection;
    money: AnnualSection;
    health: AnnualSection;
  };
}

export interface Report {
  schemaVersion: string;
  reportMeta: ReportMeta;
  subject: SubjectInfo;
  dashboard: {
    part0: DashboardPart0;
    part1: DashboardPart1;
  };
  texts: TextPart[];
  annual: AnnualFortune;
  theme: ThemeConfig;
}

function isString(value: unknown) {
  return typeof value === "string";
}

function isObject(value: unknown) {
  return typeof value === "object" && value !== null;
}

export function validateReport(report: Report): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!isObject(report)) {
    return { ok: false, errors: ["Report should be an object."] };
  }

  if (!isString(report.schemaVersion)) {
    errors.push("schemaVersion is required (string).");
  }

  if (!report.reportMeta || !isString(report.reportMeta.title)) {
    errors.push("reportMeta.title is required (string).");
  }

  if (!report.subject || !isString(report.subject.name)) {
    errors.push("subject.name is required (string).");
  }

  if (!report.dashboard?.part0) {
    errors.push("dashboard.part0 is required.");
  }

  if (!report.dashboard?.part1?.pillars?.table) {
    errors.push("dashboard.part1.pillars.table is required.");
  }

  if (!report.dashboard?.part1?.fiveElements?.counts) {
    errors.push("dashboard.part1.fiveElements.counts is required.");
  }

  if (!report.dashboard?.part1?.fiveElements?.ratio) {
    errors.push("dashboard.part1.fiveElements.ratio is required.");
  }

  if (!Array.isArray(report.dashboard?.part1?.summaryCards)) {
    errors.push("dashboard.part1.summaryCards should be an array.");
  }

  if (report.texts) {
    report.texts.forEach((item, index) => {
      if (!isString(item.partId)) {
        errors.push(`texts[${index}].partId is required (string).`);
      }
      if (!isString(item.title)) {
        errors.push(`texts[${index}].title is required (string).`);
      }
      if (!isString(item.body)) {
        errors.push(`texts[${index}].body is required (string).`);
      }
    });
  }

  if (!report.annual || report.annual.year !== 2026) {
    errors.push("annual.year must be 2026.");
  }

  const annualSections = report.annual?.sections;
  if (!annualSections) {
    errors.push("annual.sections is required.");
  } else {
    const requiredKeys = [
      "career",
      "business",
      "love",
      "money",
      "health"
    ] as const;
    requiredKeys.forEach((key) => {
      const section = annualSections[key];
      if (!section || !isString(section.title)) {
        errors.push(`annual.sections.${key}.title is required (string).`);
      }
      if (!section || !isString(section.body)) {
        errors.push(`annual.sections.${key}.body is required (string).`);
      }
    });
  }

  if (!report.theme) {
    errors.push("theme is required.");
  } else {
    if (!isString(report.theme.preset)) {
      errors.push("theme.preset is required.");
    }

    const colors = report.theme.colors;
    if (!colors) {
      errors.push("theme.colors is required.");
    } else {
      const colorKeys: (keyof ThemeColors)[] = [
        "background",
        "card",
        "border",
        "accent",
        "text",
        "mutedText"
      ];
      colorKeys.forEach((key) => {
        if (!isString(colors[key])) {
          errors.push(`theme.colors.${key} is required (string).`);
        }
      });
    }
  }

  return { ok: errors.length === 0, errors };
}
