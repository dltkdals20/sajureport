import type { Report } from "./schema";
import { getPresetTheme } from "./theme";

export const defaultTemplate: Report = {
  schemaVersion: "1.0",
  reportMeta: {
    reportId: "demo-2026-001",
    title: "2026 신년 운세 리포트",
    language: "ko",
    createdAt: "2025-12-15",
    templateVersion: "v1",
    author: "Saju Lab",
    source: "Demo"
  },
  subject: {
    name: "김해인",
    gender: "여",
    birth: {
      calendar: "solar",
      date: "1993-07-18",
      time: "09:35"
    },
    age: {
      koreanAge: 34,
      internationalAge: 33
    },
    yongsin: "화"
  },
  dashboard: {
    part0: {
      oneLineSummary: "2026년에는 관계의 확장과 실질 성과가 함께 오는 흐름입니다.",
      tags: ["균형", "성장", "대인운"],
      alerts: ["무리한 확장 주의", "건강 리듬 관리"]
    },
    part1: {
      pillars: {
        table: {
          year: {
            stem: "戊",
            branch: "辰",
            name: "무진",
            tenGod: "편인",
            stemName: "무토",
            branchName: "진토",
            stemTenGod: "편인",
            branchTenGod: "편인"
          },
          month: {
            stem: "甲",
            branch: "寅",
            name: "갑인",
            tenGod: "편재",
            stemName: "갑목",
            branchName: "인목",
            stemTenGod: "편재",
            branchTenGod: "편재"
          },
          day: {
            stem: "庚",
            branch: "戌",
            name: "경술",
            tenGod: "본원",
            stemName: "경금",
            branchName: "술토",
            stemTenGod: "비견",
            branchTenGod: "편인"
          },
          time: {
            stem: "丙",
            branch: "子",
            name: "병자",
            tenGod: "편관",
            stemName: "병화",
            branchName: "자수",
            stemTenGod: "편관",
            branchTenGod: "상관"
          }
        },
        hiddenStems: {
          year: ["계"],
          month: ["갑", "병", "무"],
          day: ["임", "갑"],
          time: ["신"]
        }
      },
      fiveElements: {
        counts: {
          목: 3,
          화: 2,
          토: 1,
          금: 2,
          수: 2
        },
        ratio: {
          목: 30,
          화: 20,
          토: 10,
          금: 20,
          수: 20
        },
        dominant: "목",
        lacking: ["토"],
        note: "목 기운이 강해 추진력이 좋지만 균형을 위해 토 기운 보완이 필요합니다."
      },
      dayMasterAnalysis: "",
      dayMasterKeywords: [],
      dayMasterHighlights: [],
      strength: {
        type: "신강",
        label: "강한 편",
        confidence: "중간",
        basis: ["월지 득령", "비견 도움"]
      },
      structure: {
        gyeokguk: "정인격",
        keyTenGod: "정인",
        note: "내적 안정감이 강하며 계획을 세우는 역량이 좋습니다."
      },
      yongsin: {
        best: ["화"],
        good: ["토"],
        bad: ["수"],
        avoid: ["금 과다"],
        table: [
          { element: "화", type: "용신", comment: "따뜻함과 추진력을 강화" },
          { element: "토", type: "희신", comment: "안정감과 현실화" },
          { element: "수", type: "기신", comment: "과도한 걱정" }
        ]
      },
      dayPillarAnalysis: "",
      dayPillarKeywords: [],
      dayPillarHighlights: [],
      summaryCards: [
        { title: "전반 흐름", value: "상승" },
        { title: "관계운", value: "확장" },
        { title: "재물운", value: "안정" },
        { title: "건강운", value: "관리 필요" }
      ]
    }
  },
  texts: [
    {
      partId: "part2",
      title: "새 파트",
      format: "plain",
      body: "",
      keywords: [],
      highlights: []
    }
  ],
  annual: {
    year: 2026,
    sections: {
      career: { title: "직장운", body: "", keywords: [], highlights: [] },
      business: { title: "사업운", body: "", keywords: [], highlights: [] },
      love: { title: "연애운", body: "", keywords: [], highlights: [] },
      money: { title: "금전운", body: "", keywords: [], highlights: [] },
      health: { title: "건강운", body: "", keywords: [], highlights: [] }
    }
  },
  theme: getPresetTheme("cream")
};
