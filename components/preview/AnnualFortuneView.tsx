import * as React from "react";
import type { AnnualFortune } from "../../lib/schema";
import { Accordion, AccordionItem } from "../ui/accordion";

interface AnnualFortuneViewProps {
  annual: AnnualFortune;
  cardStyle: React.CSSProperties;
  textColor: string;
}

export function AnnualFortuneView({
  annual,
  cardStyle,
  textColor
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
      <p className="analysis-title mb-3">2026 신년운세</p>
      <Accordion>
        {items.map((section) => (
          <AccordionItem
            key={section.title}
            title={section.title}
            defaultOpen
            className="analysis-card"
            style={cardStyle}
          >
            {section.highlights?.length ? (
              <div className="analysis-highlight">
                {section.highlights.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            ) : null}
            <div
              className="analysis-body whitespace-pre-wrap"
              style={{ color: textColor }}
            >
              {section.body || "(내용이 비어 있습니다)"}
            </div>
            {section.keywords?.length ? (
              <div className="analysis-chips">
                {section.keywords.map((keyword) => (
                  <span key={keyword} className="analysis-chip">
                    {keyword}
                  </span>
                ))}
              </div>
            ) : null}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
