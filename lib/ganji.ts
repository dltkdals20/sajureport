import type { Report } from "./schema";

type GanjiInfo = { hangul: string; element: string };

const STEM_MAP: Record<string, GanjiInfo> = {
  "甲": { hangul: "갑", element: "목" },
  "乙": { hangul: "을", element: "목" },
  "丙": { hangul: "병", element: "화" },
  "丁": { hangul: "정", element: "화" },
  "戊": { hangul: "무", element: "토" },
  "己": { hangul: "기", element: "토" },
  "庚": { hangul: "경", element: "금" },
  "辛": { hangul: "신", element: "금" },
  "壬": { hangul: "임", element: "수" },
  "癸": { hangul: "계", element: "수" }
};

const BRANCH_MAP: Record<string, GanjiInfo> = {
  "子": { hangul: "자", element: "수" },
  "丑": { hangul: "축", element: "토" },
  "寅": { hangul: "인", element: "목" },
  "卯": { hangul: "묘", element: "목" },
  "辰": { hangul: "진", element: "토" },
  "巳": { hangul: "사", element: "화" },
  "午": { hangul: "오", element: "화" },
  "未": { hangul: "미", element: "토" },
  "申": { hangul: "신", element: "금" },
  "酉": { hangul: "유", element: "금" },
  "戌": { hangul: "술", element: "토" },
  "亥": { hangul: "해", element: "수" }
};

const STEM_HANGUL_MAP: Record<string, GanjiInfo> = Object.fromEntries(
  Object.values(STEM_MAP).map((info) => [info.hangul, info])
);

const BRANCH_HANGUL_MAP: Record<string, GanjiInfo> = Object.fromEntries(
  Object.values(BRANCH_MAP).map((info) => [info.hangul, info])
);

function getStemInfo(stem?: string) {
  if (!stem) return null;
  return STEM_MAP[stem] ?? STEM_HANGUL_MAP[stem] ?? null;
}

function getBranchInfo(branch?: string) {
  if (!branch) return null;
  return BRANCH_MAP[branch] ?? BRANCH_HANGUL_MAP[branch] ?? null;
}

export function getStemName(stem?: string) {
  const info = getStemInfo(stem);
  if (!info) return "";
  return `${info.hangul}${info.element}`;
}

export function getBranchName(branch?: string) {
  const info = getBranchInfo(branch);
  if (!info) return "";
  return `${info.hangul}${info.element}`;
}

export function getGanjiName(stem?: string, branch?: string) {
  const stemInfo = getStemInfo(stem);
  const branchInfo = getBranchInfo(branch);
  if (!stemInfo || !branchInfo) return "";
  return `${stemInfo.hangul}${branchInfo.hangul}`;
}

export function fillGanjiNames(report: Report): Report {
  const table = report?.dashboard?.part1?.pillars?.table;
  if (!table) return report;

  const keys = ["time", "day", "month", "year"] as const;
  const nextTable = { ...table };

  keys.forEach((key) => {
    const cell = table[key];
    if (!cell) return;
    const stemName = cell.stemName || getStemName(cell.stem);
    const branchName = cell.branchName || getBranchName(cell.branch);
    const name = cell.name || getGanjiName(cell.stem, cell.branch);
    nextTable[key] = {
      ...cell,
      stemName: stemName || cell.stemName,
      branchName: branchName || cell.branchName,
      name: name || cell.name
    };
  });

  return {
    ...report,
    dashboard: {
      ...report.dashboard,
      part1: {
        ...report.dashboard.part1,
        pillars: {
          ...report.dashboard.part1.pillars,
          table: nextTable
        }
      }
    }
  };
}
