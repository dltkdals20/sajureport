import * as React from "react";
import type { TextPart } from "../../lib/schema";
import { Accordion, AccordionItem } from "../ui/accordion";

interface TextPartsViewProps {
  parts: TextPart[];
  cardStyle: React.CSSProperties;
  textColor: string;
}

export function TextPartsView({
  parts,
  cardStyle,
  textColor
}: TextPartsViewProps) {
  if (!parts?.length) return null;
  return (
    <Accordion>
      {parts.map((part) => (
        <AccordionItem
          key={part.partId}
          title={`${part.partId} · ${part.title}`}
          defaultOpen
          className="analysis-card"
          style={cardStyle}
        >
          {part.highlights?.length ? (
            <div className="analysis-highlight">
              {part.highlights.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </div>
          ) : null}
          <div
            className="analysis-body whitespace-pre-wrap"
            style={{ color: textColor }}
          >
            {part.body || "(내용이 비어 있습니다)"}
          </div>
          {part.keywords?.length ? (
            <div className="analysis-chips">
              {part.keywords.map((keyword) => (
                <span key={keyword} className="analysis-chip">
                  {keyword}
                </span>
              ))}
            </div>
          ) : null}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
