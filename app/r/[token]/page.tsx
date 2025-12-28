import { notFound } from "next/navigation";
import type { Report } from "../../../lib/schema";
import { supabaseServer } from "../../../lib/supabaseServer";
import { PreviewPanel } from "../../../components/PreviewPanel";

export const dynamic = "force-dynamic";

interface SharePageProps {
  params: { token: string };
}

export default async function SharePage({ params }: SharePageProps) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("reports")
    .select("report, expires_at")
    .eq("token", params.token)
    .single();

  if (error || !data?.report) {
    notFound();
  }

  if (data.expires_at) {
    const expiresAt = new Date(data.expires_at);
    if (!Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() < Date.now()) {
      notFound();
    }
  }

  const report = data.report as Report;

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <PreviewPanel report={report} />
    </main>
  );
}
