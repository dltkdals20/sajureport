import * as React from "react";
import type { YongsinInfo } from "../../lib/schema";

interface YongsinTableProps {
  yongsin: YongsinInfo;
  cardStyle: React.CSSProperties;
  borderColor: string;
  textColor: string;
  mutedText: string;
  accentColor: string;
}

function Chip({ label, accentColor }: { label: string; accentColor: string }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 text-xs"
      style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
    >
      {label}
    </span>
  );
}

export function YongsinTable({
  yongsin,
  cardStyle,
  borderColor,
  textColor,
  mutedText,
  accentColor
}: YongsinTableProps) {
  if (!yongsin) return null;
  return (
    <div style={cardStyle} className="border px-4 py-4">
      <p className="mb-3 text-sm font-semibold" style={{ color: textColor }}>
        용신 분석
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {yongsin.best?.map((item) => (
          <Chip key={`best-${item}`} label={`용신 ${item}`} accentColor={accentColor} />
        ))}
        {yongsin.good?.map((item) => (
          <Chip key={`good-${item}`} label={`희신 ${item}`} accentColor={accentColor} />
        ))}
        {yongsin.bad?.map((item) => (
          <Chip key={`bad-${item}`} label={`기신 ${item}`} accentColor={accentColor} />
        ))}
        {yongsin.avoid?.map((item) => (
          <Chip key={`avoid-${item}`} label={`주의 ${item}`} accentColor={accentColor} />
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="py-2 text-left" style={{ color: mutedText }}>
                오행
              </th>
              <th className="py-2 text-left" style={{ color: mutedText }}>
                구분
              </th>
              <th className="py-2 text-left" style={{ color: mutedText }}>
                코멘트
              </th>
            </tr>
          </thead>
          <tbody>
            {yongsin.table?.map((row, index) => (
              <tr key={`${row.element}-${index}`} className="border-t" style={{ borderColor }}>
                <td className="py-2 font-medium">{row.element}</td>
                <td className="py-2">{row.type}</td>
                <td className="py-2" style={{ color: mutedText }}>
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
