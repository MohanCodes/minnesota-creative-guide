"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyLinkButtonProps {
  url: string;
  className?: string;
}

export function CopyLinkButton({ url, className }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy link"
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1 hover:bg-accent/20 transition-colors",
        className,
      )}
    >
      {copied ? (
        <Check className="h-4 w-4 text-background" />
      ) : (
        <Copy className="h-4 w-4 text-background/60" />
      )}
    </button>
  );
}
