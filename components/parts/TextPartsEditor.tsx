import * as React from "react";
import type { TextPart } from "../../lib/schema";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";

interface TextPartsEditorProps {
  parts: TextPart[];
  onChange: (parts: TextPart[]) => void;
}

export function TextPartsEditor({ parts, onChange }: TextPartsEditorProps) {
  const keyRef = React.useRef(0);
  const [keys, setKeys] = React.useState<string[]>(() =>
    parts.map(() => `part-${keyRef.current++}`)
  );

  React.useEffect(() => {
    setKeys((prev) => {
      const next = [...prev];
      while (next.length < parts.length) {
        next.push(`part-${keyRef.current++}`);
      }
      if (next.length > parts.length) {
        next.splice(parts.length);
      }
      return next;
    });
  }, [parts.length]);

  const updatePart = (index: number, patch: Partial<TextPart>) => {
    const next = parts.map((item, i) =>
      i === index ? { ...item, ...patch } : item
    );
    onChange(next);
  };

  const removePart = (index: number) => {
    const next = parts.filter((_, i) => i !== index);
    onChange(next);
    setKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const addPart = () => {
    const nextIndex = parts.length + 2;
    const nextPart: TextPart = {
      partId: `part${nextIndex}`,
      title: "새 파트",
      format: "plain",
      body: ""
    };
    onChange([...parts, nextPart]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-800">Part2+ 원문</p>
          <p className="text-xs text-neutral-500">
            여기에 PartX 원문을 그대로 붙여넣으세요(줄바꿈 포함)
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={addPart}>
          + 파트 추가
        </Button>
      </div>

      <div className="space-y-5">
        {parts.map((part, index) => (
          <div
            key={keys[index]}
            className="rounded-2xl border border-neutral-200 bg-white/70 p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-700">
                {part.partId || `파트 ${index + 2}`}
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removePart(index)}
              >
                삭제
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1">
                <Label>partId</Label>
                <Input
                  value={part.partId}
                  onChange={(event) =>
                    updatePart(index, { partId: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>title</Label>
                <Input
                  value={part.title}
                  onChange={(event) =>
                    updatePart(index, { title: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>format</Label>
                <Select
                  value={part.format}
                  onChange={(event) =>
                    updatePart(index, {
                      format: event.target.value as "plain" | "markdown"
                    })
                  }
                >
                  <option value="plain">plain</option>
                  <option value="markdown">markdown</option>
                </Select>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Label>body</Label>
              <Textarea
                className="min-h-[220px] resize-y"
                value={part.body}
                onChange={(event) =>
                  updatePart(index, { body: event.target.value })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
