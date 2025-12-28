import { notFound } from "next/navigation";
import { supabaseServer } from "../../../lib/supabaseServer";
import { ReportActions } from "../../../components/admin/ReportActions";

const PAGE_SIZE = 50;

type SearchParams = {
  key?: string;
  q?: string;
  name?: string;
  rid?: string;
  page?: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function buildQuery(params: SearchParams, overrides?: Partial<SearchParams>) {
  const merged = { ...params, ...overrides };
  const search = new URLSearchParams();
  Object.entries(merged).forEach(([key, value]) => {
    if (!value) return;
    search.set(key, String(value));
  });
  return search.toString();
}

interface AdminReportsPageProps {
  searchParams?: SearchParams;
}

export default async function AdminReportsPage({
  searchParams = {}
}: AdminReportsPageProps) {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || searchParams.key !== adminSecret) {
    notFound();
  }

  const page = Math.max(1, Number(searchParams.page ?? 1) || 1);
  const offset = (page - 1) * PAGE_SIZE;
  const supabase = supabaseServer();

  let query = supabase
    .from("reports")
    .select("created_at, subject_name, report_id, token, expires_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  if (searchParams.q) {
    const q = searchParams.q.trim();
    if (q) {
      query = query.or(`subject_name.ilike.%${q}%,report_id.ilike.%${q}%`);
    }
  } else {
    if (searchParams.name) {
      query = query.ilike("subject_name", `%${searchParams.name}%`);
    }
    if (searchParams.rid) {
      query = query.ilike("report_id", `%${searchParams.rid}%`);
    }
  }

  const { data, error, count } = await query;

  const total = count ?? 0;
  const hasNext = count === null ? true : offset + PAGE_SIZE < total;
  const hasPrev = page > 1;

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Admin
          </p>
          <h1 className="font-display text-2xl font-semibold text-neutral-900">
            Reports
          </h1>
          <p className="text-sm text-neutral-500">
            최근 생성된 리포트를 검색하고 공유 링크를 확인합니다.
          </p>
        </header>

        <form className="grid gap-3 rounded-3xl border border-neutral-200 bg-white/70 p-4 shadow-sm md:grid-cols-4">
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-medium text-neutral-600">통합 검색</label>
            <input
              name="q"
              defaultValue={searchParams.q ?? ""}
              placeholder="subject name 또는 report id"
              className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-600">Subject</label>
            <input
              name="name"
              defaultValue={searchParams.name ?? ""}
              placeholder="이름 검색"
              className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-600">Report ID</label>
            <input
              name="rid"
              defaultValue={searchParams.rid ?? ""}
              placeholder="리포트 ID"
              className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm"
            />
          </div>
          <input type="hidden" name="key" value={searchParams.key ?? ""} />
          <button
            type="submit"
            className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white md:col-span-4"
          >
            검색
          </button>
        </form>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error.message}
          </div>
        )}

        {!error && data && data.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white/70 p-6 text-sm text-neutral-500">
            검색 결과가 없습니다.
          </div>
        )}

        {!error && data && data.length > 0 && (
          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white/70 shadow-sm">
            <div className="grid grid-cols-12 gap-4 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold text-neutral-500">
              <div className="col-span-3">Created</div>
              <div className="col-span-3">Subject</div>
              <div className="col-span-2">Report ID</div>
              <div className="col-span-2">Expires</div>
              <div className="col-span-2">Actions</div>
            </div>
            <div className="divide-y divide-neutral-200">
              {data.map((row) => (
                <div
                  key={row.token}
                  className="grid grid-cols-12 gap-4 px-4 py-4 text-sm"
                >
                  <div className="col-span-3 text-neutral-600">
                    {formatDate(row.created_at)}
                  </div>
                  <div className="col-span-3 font-medium text-neutral-900">
                    {row.subject_name || "-"}
                  </div>
                  <div className="col-span-2 text-neutral-600">
                    {row.report_id || "-"}
                  </div>
                  <div className="col-span-2 text-neutral-600">
                    {row.expires_at ? formatDate(row.expires_at) : "-"}
                  </div>
                  <div className="col-span-2">
                    <ReportActions token={row.token} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-neutral-500">
            {count !== null ? `총 ${total}건` : ""}
          </div>
          <div className="flex gap-2">
            {hasPrev && (
              <a
                className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs"
                href={`/admin/reports?${buildQuery(searchParams, {
                  page: String(page - 1)
                })}`}
              >
                Prev
              </a>
            )}
            {hasNext && (
              <a
                className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs"
                href={`/admin/reports?${buildQuery(searchParams, {
                  page: String(page + 1)
                })}`}
              >
                Next
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
