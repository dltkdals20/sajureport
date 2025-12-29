import * as React from "react";
import type { YongsinInfo } from "../../lib/schema";

interface YongsinTableProps {
  yongsin: YongsinInfo;
  cardStyle: React.CSSProperties;
  borderColor: string;
  className?: string;
}

function Chip({ label }: { label: string }) {
  return <span className="analysis-chip">{label}</span>;
}

export function YongsinTable({
  yongsin,
  cardStyle,
  borderColor,
  className
}: YongsinTableProps) {
  if (!yongsin) return null;
  return (
    <div
      style={cardStyle}
      className={`border px-3 py-4 sm:px-4 sm:py-4 ${className ?? ""}`}
    >
      <p className="analysis-title mb-3">용신 분석</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {yongsin.best?.map((item) => (
          <Chip key={`best-${item}`} label={`용신 ${item}`} />
        ))}
        {yongsin.good?.map((item) => (
          <Chip key={`good-${item}`} label={`희신 ${item}`} />
        ))}
        {yongsin.bad?.map((item) => (
          <Chip key={`bad-${item}`} label={`기신 ${item}`} />
        ))}
        {yongsin.avoid?.map((item) => (
          <Chip key={`avoid-${item}`} label={`주의 ${item}`} />
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="analysis-table w-full min-w-[520px] border-collapse text-sm sm:text-base">
          <thead>
            <tr>
              <th className="py-2 text-left">오행</th>
              <th className="py-2 text-left">구분</th>
              <th className="py-2 text-left">코멘트</th>
            </tr>
          </thead>
          <tbody>
            {yongsin.table?.map((row, index) => (
              <tr key={`${row.element}-${index}`} className="border-t" style={{ borderColor }}>
                <td className="py-2 font-medium">{row.element}</td>
                <td className="py-2">{row.type}</td>
                <td className="py-2 break-words">
                  {row.comment}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
