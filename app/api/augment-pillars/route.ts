import { NextResponse } from "next/server";
import type { Report } from "../../../lib/schema";

export const runtime = "nodejs";

type PillarKey = "time" | "day" | "month" | "year";

type PillarFill = Record<
  PillarKey,
  {
    stemName?: string;
    branchName?: string;
    stemTenGod?: string;
    branchTenGod?: string;
  }
>;

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

function needsAugment(report: Report) {
  const table = report?.dashboard?.part1?.pillars?.table;
  if (!table) return false;
  const keys: PillarKey[] = ["time", "day", "month", "year"];
  return keys.some((key) => {
    const cell = table[key];
    return (
      !cell?.stemName ||
      !cell?.branchName ||
      !cell?.stemTenGod ||
      !cell?.branchTenGod
    );
  });
}

function mergeFill(report: Report, fill: PillarFill): Report {
  const table = report.dashboard.part1.pillars.table;
  const keys: PillarKey[] = ["time", "day", "month", "year"];

  const nextTable = { ...table };
  keys.forEach((key) => {
    const cell = table[key];
    const patch = fill[key] ?? {};
    nextTable[key] = {
      ...cell,
      stemName: cell.stemName || patch.stemName || "",
      branchName: cell.branchName || patch.branchName || "",
      stemTenGod: cell.stemTenGod || patch.stemTenGod || "",
      branchTenGod: cell.branchTenGod || patch.branchTenGod || ""
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

export async function POST(req: Request) {
  try {
    const { report } = (await req.json()) as { report: Report };
    if (!report?.dashboard?.part1?.pillars?.table) {
      return NextResponse.json(
        { error: "pillars.table이 없습니다." },
        { status: 400 }
      );
    }

    if (!needsAugment(report)) {
      return NextResponse.json({ report });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const table = report.dashboard.part1.pillars.table;
    const payload = {
      time: table.time,
      day: table.day,
      month: table.month,
      year: table.year
    };

    const prompt = `사주 팔자 4기둥 정보가 있습니다. 각 기둥의 천간/지지에 대해 한글 명칭(stemName/branchName)과 십성(stemTenGod/branchTenGod)을 채워 주세요.\n\n입력(JSON):\n${JSON.stringify(
      payload,
      null,
      2
    )}\n\n출력 JSON 형식(반드시 이 구조로만):\n{\n  "time": {"stemName": "", "branchName": "", "stemTenGod": "", "branchTenGod": ""},\n  "day": {"stemName": "", "branchName": "", "stemTenGod": "", "branchTenGod": ""},\n  "month": {"stemName": "", "branchName": "", "stemTenGod": "", "branchTenGod": ""},\n  "year": {"stemName": "", "branchName": "", "stemTenGod": "", "branchTenGod": ""}\n}\n\n조건: 값은 한국어로 작성하고, 모르면 빈 문자열로 둡니다. JSON 외의 텍스트는 출력하지 마세요.`;

    const envModel = process.env.GEMINI_MODEL;
    const availableModels = await listAvailableModels(apiKey);
    const modelCandidates = [
      envModel,
      ...availableModels,
      ...fallbackModels
    ].filter(Boolean) as string[];
    const triedModels: string[] = [];
    const errorSummaries: string[] = [];
    let response: Response | null = null;
    let usedModel = "";
    let lastErrorText = "";

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
              temperature: 0.2
            }
          })
        }
      );

      if (res.ok) {
        response = res;
        usedModel = model;
        break;
      }

      lastErrorText = await res.text();
      errorSummaries.push(`${model}: ${res.status} ${lastErrorText}`);
      if (res.status === 401 || res.status === 403) {
        return NextResponse.json(
          { error: `Gemini API 인증 오류(${model}): ${lastErrorText}` },
          { status: 502 }
        );
      }
    }

    if (!response) {
      return NextResponse.json(
        {
          error: `Gemini API 오류(시도: ${triedModels.join(", ")}): ${
            errorSummaries[errorSummaries.length - 1] ?? lastErrorText
          }`
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json(
        { error: `Gemini 응답이 비어 있습니다(${usedModel}).` },
        { status: 502 }
      );
    }

    let fill: PillarFill;
    try {
      fill = JSON.parse(text) as PillarFill;
    } catch (error) {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start >= 0 && end > start) {
        try {
          fill = JSON.parse(text.slice(start, end + 1)) as PillarFill;
        } catch (parseError) {
          return NextResponse.json(
            { error: "Gemini 응답 JSON 파싱 실패" },
            { status: 502 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Gemini 응답 JSON 파싱 실패" },
          { status: 502 }
        );
      }
    }

    const merged = mergeFill(report, fill);
    return NextResponse.json({ report: merged });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
