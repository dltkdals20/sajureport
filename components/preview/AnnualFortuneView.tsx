import * as React from "react";
import type { AnnualFortune } from "../../lib/schema";
import { Accordion, AccordionItem } from "../ui/accordion";

interface AnnualFortuneViewProps {
  annual: AnnualFortune;
  cardStyle: React.CSSProperties;
  textColor: string;
  accentColor: string;
}

export function AnnualFortuneView({
  annual,
  cardStyle,
  textColor,
  accentColor
}: AnnualFortuneViewProps) {
  if (!annual) return null;
  const sections = annual.sections;
  const items = [
    sections.career,
    sections.business,
    sections.love,
    sections.money,
    sections.health
  ];

  return (
    <div>
      <p className="mb-3 text-sm font-semibold" style={{ color: textColor }}>
        2026 신년운세
      </p>
      <Accordion>
        {items.map((section) => (
          <AccordionItem
            key={section.title}
            title={section.title}
            defaultOpen
            style={cardStyle}
          >
            {section.highlights?.length ? (
              <div className="mb-3 space-y-2">
                {section.highlights.map((text) => (
                  <p
                    key={text}
                    className="text-base sm:text-lg font-semibold"
                    style={{ color: accentColor }}
                  >
                    {text}
                  </p>
                ))}
              </div>
            ) : null}
            {section.keywords?.length ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {section.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full px-3 py-1 text-xs"
                    style={{
                      backgroundColor: `${accentColor}22`,
                      color: accentColor
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            ) : null}
            <div
              className="whitespace-pre-wrap text-sm leading-6"
              style={{ color: textColor }}
            >
              {section.body || "(내용이 비어 있습니다)"}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
