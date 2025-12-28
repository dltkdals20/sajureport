import { NextResponse } from "next/server";
import type { Report } from "../../../lib/schema";

export const runtime = "nodejs";

type FormatResult = {
  body: string;
  keywords: string[];
  highlights: string[];
};

type FormatTextItem = FormatResult & { partId: string };

type FormatAnnual = Record<string, FormatResult>;

const fallbackModels = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
  "gemini-pro"
];

function normalizeModelName(name: string) {
  return name.startsWith("models/") ? name.replace("models/", "") : name;
}

function prioritizeModels(models: string[]) {
  const unique = new Set(models.filter(Boolean));
  const prioritized: string[] = [];
  fallbackModels.forEach((model) => {
    if (unique.has(model)) {
      prioritized.push(model);
      unique.delete(model);
    }
  });
  unique.forEach((model) => prioritized.push(model));
  return prioritized;
}

async function listAvailableModels(apiKey: string) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    const models = Array.isArray(data?.models) ? data.models : [];
    const names = models
      .filter((model: { supportedGenerationMethods?: string[] }) =>
        (model.supportedGenerationMethods ?? []).includes("generateContent")
      )
      .map((model: { name?: string }) =>
        model.name ? normalizeModelName(model.name) : ""
      )
      .filter(Boolean);
    return prioritizeModels(names);
  } catch (error) {
    return [];
  }
}

function buildPrompt(report: Report) {
  const texts = (report.texts ?? []).map((part) => ({
    partId: part.partId,
    title: part.title,
    body: part.body
  }));
  const annual = report.annual?.sections ?? {};

  return `다음은 사주 분석 원문입니다. 요약하지 말고 내용은 그대로 유지하되, 문장을 정렬하고 핵심 키워드와 강조 문장을 만들어 주세요.\n\n요청 사항:\n- 요약 금지 (원문 내용을 삭제하거나 축약하지 말 것)\n- 문장 정리/정돈 (중복 제거 및 문장 흐름 정돈 가능)\n- 키워드 5~8개 생성\n- 강조 문장 1~3개 생성 (중요 포인트를 짧게)\n- 필요하면 표(테이블) 형식으로 정리해도 됨\n- 마크다운 강조 기호(**) 사용 금지\n- 출력은 반드시 JSON만\n\n입력(JSON):\n{\n  "dayMasterText": ${JSON.stringify(
    report.dashboard.part1.dayMasterAnalysis ?? ""
  )},\n  "dayPillarText": ${JSON.stringify(
    report.dashboard.part1.dayPillarAnalysis ?? ""
  )},\n  "texts": ${JSON.stringify(texts)},\n  "annual": ${JSON.stringify(annual)}\n}\n\n출력 JSON 형식(반드시 이 구조로만):\n{\n  "dayMaster": {"body": "", "keywords": [], "highlights": []},\n  "dayPillar": {"body": "", "keywords": [], "highlights": []},\n  "texts": [\n    {"partId": "part2", "body": "", "keywords": [], "highlights": []}\n  ],\n  "annual": {\n    "career": {"body": "", "keywords": [], "highlights": []},\n    "business": {"body": "", "keywords": [], "highlights": []},\n    "love": {"body": "", "keywords": [], "highlights": []},\n    "money": {"body": "", "keywords": [], "highlights": []},\n    "health": {"body": "", "keywords": [], "highlights": []}\n  }\n}\n\n조건: 한국어로 작성하고, 원문이 비어 있으면 body는 빈 문자열로 유지합니다.`;
}

async function callGemini(apiKey: string, prompt: string) {
  const envModel = process.env.GEMINI_MODEL;
  const availableModels = await listAvailableModels(apiKey);
  const modelCandidates = [
    envModel,
    ...availableModels,
    ...fallbackModels
  ].filter(Boolean) as string[];
  const triedModels: string[] = [];
  const errorSummaries: string[] = [];

  for (const model of modelCandidates) {
    if (triedModels.includes(model)) continue;
    triedModels.push(model);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3
          }
        })
      }
    );

    if (res.ok) {
      return { res, model };
    }

    const err = await res.text();
    errorSummaries.push(`${model}: ${res.status} ${err}`);
    if (res.status === 401 || res.status === 403) {
      return {
        res: null,
        model,
        error: `Gemini API 인증 오류(${model}): ${err}`
      };
    }
  }

  return {
    res: null,
    model: "",
    error: `Gemini API 오류(시도: ${triedModels.join(", ")}): ${
      errorSummaries[errorSummaries.length - 1] ?? "요청 실패"
    }`
  };
}

function parseJsonText(text: string) {
  try {
    return JSON.parse(text);
  } catch (error) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(text.slice(start, end + 1));
    }
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { report } = (await req.json()) as { report: Report };
    if (!report?.dashboard?.part1) {
      return NextResponse.json(
        { error: "report.dashboard.part1이 없습니다." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const prompt = buildPrompt(report);
    const result = await callGemini(apiKey, prompt);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    if (!result.res) {
      return NextResponse.json(
        { error: "Gemini 요청 실패" },
        { status: 502 }
      );
    }

    const data = await result.res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json(
        { error: `Gemini 응답이 비어 있습니다(${result.model}).` },
        { status: 502 }
      );
    }

    const parsed = parseJsonText(text) as {
      dayMaster?: FormatResult;
      dayPillar?: FormatResult;
      texts?: FormatTextItem[];
      annual?: FormatAnnual;
    };

    const textMap = new Map(
      (parsed.texts ?? []).map((item) => [item.partId, item])
    );
    const annual = parsed.annual ?? {};

    const nextReport: Report = {
      ...report,
      dashboard: {
        ...report.dashboard,
        part1: {
          ...report.dashboard.part1,
          dayMasterAnalysis:
            parsed.dayMaster?.body ?? report.dashboard.part1.dayMasterAnalysis ?? "",
          dayMasterKeywords:
            parsed.dayMaster?.keywords ?? report.dashboard.part1.dayMasterKeywords ?? [],
          dayMasterHighlights:
            parsed.dayMaster?.highlights ?? report.dashboard.part1.dayMasterHighlights ?? [],
          dayPillarAnalysis:
            parsed.dayPillar?.body ?? report.dashboard.part1.dayPillarAnalysis ?? "",
          dayPillarKeywords:
            parsed.dayPillar?.keywords ?? report.dashboard.part1.dayPillarKeywords ?? [],
          dayPillarHighlights:
            parsed.dayPillar?.highlights ?? report.dashboard.part1.dayPillarHighlights ?? []
        }
      },
      texts: (report.texts ?? []).map((part) => {
        const formatted = textMap.get(part.partId);
        if (!formatted) return part;
        return {
          ...part,
          body: formatted.body ?? part.body,
          keywords: formatted.keywords ?? part.keywords ?? [],
          highlights: formatted.highlights ?? part.highlights ?? []
        };
      }),
      annual: {
        ...report.annual,
        sections: {
          ...report.annual.sections,
          career: {
            ...report.annual.sections.career,
            body: annual.career?.body ?? report.annual.sections.career.body,
            keywords:
              annual.career?.keywords ??
              report.annual.sections.career.keywords ??
              [],
            highlights:
              annual.career?.highlights ??
              report.annual.sections.career.highlights ??
              []
          },
          business: {
            ...report.annual.sections.business,
            body: annual.business?.body ?? report.annual.sections.business.body,
            keywords:
              annual.business?.keywords ??
              report.annual.sections.business.keywords ??
              [],
            highlights:
              annual.business?.highlights ??
              report.annual.sections.business.highlights ??
              []
          },
          love: {
            ...report.annual.sections.love,
            body: annual.love?.body ?? report.annual.sections.love.body,
            keywords:
              annual.love?.keywords ?? report.annual.sections.love.keywords ?? [],
            highlights:
              annual.love?.highlights ??
              report.annual.sections.love.highlights ??
              []
          },
          money: {
            ...report.annual.sections.money,
            body: annual.money?.body ?? report.annual.sections.money.body,
            keywords:
              annual.money?.keywords ??
              report.annual.sections.money.keywords ??
              [],
            highlights:
              annual.money?.highlights ??
              report.annual.sections.money.highlights ??
              []
          },
          health: {
            ...report.annual.sections.health,
            body: annual.health?.body ?? report.annual.sections.health.body,
            keywords:
              annual.health?.keywords ??
              report.annual.sections.health.keywords ??
              [],
            highlights:
              annual.health?.highlights ??
              report.annual.sections.health.highlights ??
              []
          }
        }
      }
    };

    return NextResponse.json({ report: nextReport });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
