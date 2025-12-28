import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabaseServer";

export const runtime = "nodejs";

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

    const { token } = (await req.json()) as { token?: string };
    if (!token) {
      return NextResponse.json(
        { error: "token이 필요합니다." },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("reports")
      .delete()
      .eq("token", token)
      .select("token")
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: `Supabase delete 실패: ${error.message}` },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "서버 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
