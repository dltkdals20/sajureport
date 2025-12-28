import * as React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface FiveElementsChartProps {
  ratio: Record<string, number>;
  counts: Record<string, number>;
  accentColor: string;
  textColor: string;
  mutedText: string;
  cardStyle: React.CSSProperties;
}

export function FiveElementsChart({
  ratio,
  counts,
  accentColor,
  textColor,
  mutedText,
  cardStyle
}: FiveElementsChartProps) {
  const data = Object.keys(ratio ?? {}).map((key) => ({
    name: key,
    ratio: ratio[key],
    count: counts?.[key] ?? 0
  }));

  return (
    <div style={cardStyle} className="border px-3 py-4 sm:px-4 sm:py-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: textColor }}>
          오행 분포
        </p>
        <p className="text-xs" style={{ color: mutedText }}>
          ratio / count
        </p>
      </div>
      <div className="mt-4 h-40 sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis
              type="category"
              dataKey="name"
              width={40}
              tick={{ fill: mutedText, fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.04)" }}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${accentColor}`
              }}
              formatter={(value) => [`${value}%`, "비율"]}
            />
            <Bar dataKey="ratio" fill={accentColor} radius={[8, 8, 8, 8]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs" style={{ color: mutedText }}>
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <span>{item.name}</span>
            <span>
              {item.ratio}% · {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
