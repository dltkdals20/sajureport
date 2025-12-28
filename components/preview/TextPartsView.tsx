import * as React from "react";
import type { TextPart } from "../../lib/schema";
import { Accordion, AccordionItem } from "../ui/accordion";

interface TextPartsViewProps {
  parts: TextPart[];
  cardStyle: React.CSSProperties;
  textColor: string;
  accentColor: string;
}

export function TextPartsView({
  parts,
  cardStyle,
  textColor,
  accentColor
}: TextPartsViewProps) {
  if (!parts?.length) return null;
  return (
    <Accordion>
      {parts.map((part) => (
        <AccordionItem
          key={part.partId}
          title={`${part.partId} · ${part.title}`}
          defaultOpen
          style={cardStyle}
        >
          {part.highlights?.length ? (
            <div className="mb-3 space-y-2">
              {part.highlights.map((text) => (
                <p
                  key={text}
                  className="text-lg sm:text-xl font-semibold"
                  style={{ color: accentColor }}
                >
                  {text}
                </p>
              ))}
            </div>
          ) : null}
          {part.keywords?.length ? (
            <div className="mb-3 flex flex-wrap gap-2">
                {part.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full px-3 py-1 text-sm"
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
            className="whitespace-pre-wrap text-base leading-7"
            style={{ color: textColor }}
          >
            {part.body || "(내용이 비어 있습니다)"}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
