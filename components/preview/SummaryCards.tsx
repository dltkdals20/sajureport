import * as React from "react";
import type { SummaryCard } from "../../lib/schema";

interface SummaryCardsProps {
  cards: SummaryCard[];
  cardStyle: React.CSSProperties;
  accentColor: string;
  textColor: string;
  mutedText: string;
}

export function SummaryCards({
  cards,
  cardStyle,
  accentColor,
  textColor,
  mutedText
}: SummaryCardsProps) {
  if (!cards?.length) return null;
  return (
    <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={`${card.title}-${index}`}
          style={cardStyle}
          className="flex flex-col gap-2 border px-3 py-3 sm:px-4 sm:py-4"
        >
          <p className="text-xs uppercase tracking-wide" style={{ color: mutedText }}>
            {card.title}
          </p>
          <p
            className="text-lg font-semibold"
            style={{ color: textColor }}
          >
            {card.value}
          </p>
          <span
            className="h-1 w-10 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      ))}
    </div>
  );
}
