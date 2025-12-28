import { NextResponse } from "next/server";
import crypto from "crypto";
import type { Report } from "../../../../lib/schema";
import { supabaseServer } from "../../../../lib/supabaseServer";

export const runtime = "nodejs";

function getReportId(report: Report) {
  const meta = report.reportMeta as Record<string, string | undefined>;
  return meta.reportId || meta.id || "";
}

export async function POST(req: Request) {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return NextResponse.json(
        { error: "ADMIN_SECRET이 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const headerSecret = req.headers.get("x-admin-secret");
    if (!headerSecret || headerSecret !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { report } = (await req.json()) as { report?: Report };
    if (!report) {
      return NextResponse.json(
        { error: "report가 필요합니다." },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const reportId = getReportId(report);
    const subjectName = report.subject?.name ?? "";
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const supabase = supabaseServer();
    const { error } = await supabase.from("reports").insert({
      token,
      report_id: reportId,
      subject_name: subjectName,
      report,
      expires_at: expiresAt
    });

    if (error) {
      return NextResponse.json(
        { error: `Supabase insert 실패: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ token, url: `/r/${token}` });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
