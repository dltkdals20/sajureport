"use client";

import * as React from "react";
import { Button } from "../ui/button";

interface ReportActionsProps {
  token: string;
}

export function ReportActions({ token }: ReportActionsProps) {
  const [copied, setCopied] = React.useState(false);
  const href = `/r/${token}`;

  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}${href}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      setCopied(false);
    }
  };

  const handleOpen = () => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={handleOpen}>
        Open
      </Button>
      <Button size="sm" variant="ghost" onClick={handleCopy}>
        {copied ? "Copied" : "Copy link"}
      </Button>
    </div>
  );
}
