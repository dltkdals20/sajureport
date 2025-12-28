import * as React from "react";
import type { PillarsTable } from "../../lib/schema";
import { getBranchName, getStemName } from "../../lib/ganji";

interface PillarsTableProps {
  table: PillarsTable;
  hiddenStems?: Record<string, string[]>;
  cardStyle: React.CSSProperties;
  borderColor: string;
  textColor: string;
  mutedText: string;
  accentColor: string;
}

export function PillarsTable({
  table,
  hiddenStems,
  cardStyle,
  borderColor,
  textColor,
  mutedText,
  accentColor
}: PillarsTableProps) {
  if (!table) return null;
  const columns = [
    { key: "time", label: "시주", subLabel: "Hour" },
    { key: "day", label: "일주", subLabel: "Day" },
    { key: "month", label: "월주", subLabel: "Month" },
    { key: "year", label: "연주", subLabel: "Year" }
  ] as const;

  const getBadgeStyle = (active: boolean): React.CSSProperties => ({
    backgroundColor: active ? accentColor : `${accentColor}1A`,
    color: active ? "#fff" : accentColor
  });

  return (
    <div style={cardStyle} className="border px-4 py-4">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="h-10 w-1.5 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <div>
          <p className="text-lg font-semibold" style={{ color: textColor }}>
            사주팔자 (Four Pillars)
          </p>
          <p className="text-xs" style={{ color: mutedText }}>
            시주 · 일주 · 월주 · 연주
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-base leading-6">
          <thead>
            <tr>
              {columns.map(({ key, label, subLabel }) => (
                <th
                  key={key}
                  className="py-3 text-center text-base font-semibold"
                  style={{
                    color: textColor,
                    borderBottom: `1px solid ${borderColor}`,
                    borderTop: `1px solid ${borderColor}`
                  }}
                >
                  <div>{label}</div>
                  <div className="text-xs font-medium" style={{ color: mutedText }}>
                    ({subLabel})
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {columns.map(({ key }) => {
                const cell = table[key];
                const label = cell?.stemName || getStemName(cell?.stem) || cell?.name || "-";
                const tenGod = cell?.stemTenGod ?? cell?.tenGod ?? "-";
                const active = key === "day";
                return (
                  <td
                    key={key}
                    className="border-x px-4 py-6 text-center"
                    style={{ borderColor }}
                  >
                    <div className="mb-3 flex justify-center">
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={getBadgeStyle(active)}
                      >
                        {tenGod}
                      </span>
                    </div>
                    <div className="text-4xl font-semibold" style={{ color: textColor }}>
                      {cell?.stem ?? "-"}
                    </div>
                    <div className="mt-2 text-sm font-medium" style={{ color: mutedText }}>
                      {label}
                    </div>
                  </td>
                );
              })}
            </tr>
            <tr>
              {columns.map(({ key }) => {
                const cell = table[key];
                const label = cell?.branchName || getBranchName(cell?.branch) || "-";
                const tenGod = cell?.branchTenGod ?? cell?.tenGod ?? "-";
                return (
                  <td
                    key={key}
                    className="border-x border-t px-4 py-6 text-center"
                    style={{ borderColor }}
                  >
                    <div className="mb-3 flex justify-center">
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={getBadgeStyle(false)}
                      >
                        {tenGod}
                      </span>
                    </div>
                    <div className="text-4xl font-semibold" style={{ color: textColor }}>
                      {cell?.branch ?? "-"}
                    </div>
                    <div className="mt-2 text-sm font-medium" style={{ color: mutedText }}>
                      {label}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
      {hiddenStems && (
        <div className="mt-3 text-xs" style={{ color: mutedText }}>
          {columns.map(({ key, label }) => (
            <p key={key}>
              {label} 숨은 기운: {hiddenStems[key]?.join(", ") ?? "-"}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
