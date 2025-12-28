import * as React from "react";
import type { AnnualFortune } from "../../lib/schema";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface AnnualFortuneEditorProps {
  annual: AnnualFortune;
  onChange: (annual: AnnualFortune) => void;
}

const sections = [
  { key: "career", label: "직장운" },
  { key: "business", label: "사업운" },
  { key: "love", label: "연애운" },
  { key: "money", label: "금전운" },
  { key: "health", label: "건강운" }
] as const;

export function AnnualFortuneEditor({
  annual,
  onChange
}: AnnualFortuneEditorProps) {
  const updateSection = (
    key: (typeof sections)[number]["key"],
    label: string,
    value: string
  ) => {
    const current = annual.sections?.[key];
    onChange({
      ...annual,
      sections: {
        ...annual.sections,
        [key]: {
          title: current?.title ?? label,
          body: value
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-neutral-800">2026 신년운세</p>
        <p className="text-xs text-neutral-500">연도는 고정되어 있습니다.</p>
      </div>
      <div className="rounded-2xl border border-neutral-200 bg-white/70 p-4">
        <Label>year</Label>
        <p className="mt-1 text-sm font-medium text-neutral-700">{annual.year}</p>
      </div>
      <div className="space-y-4">
        {sections.map((section) => {
          const current = annual.sections?.[section.key];
          return (
            <div
              key={section.key}
              className="space-y-2 rounded-2xl border border-neutral-200 bg-white/70 p-4"
            >
              <div className="flex items-center justify-between">
                <Label>{section.label}</Label>
                <span className="text-xs text-neutral-400">
                  {current?.title ?? section.label}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                여기에 2026년 {section.label} 원문을 그대로 붙여넣으세요
              </p>
              <Textarea
                className="min-h-[220px] resize-y"
                value={current?.body ?? ""}
                onChange={(event) =>
                  updateSection(section.key, section.label, event.target.value)
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
