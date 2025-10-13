"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import * as React from "react";

type AccordionItemProps = {
  id: string;
  question: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function AccordionItem({
  id,
  question,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const contentId = `${id}-content`;
  const buttonId = `${id}-button`;

  return (
    <article
      data-open={open}
      className={cn(
        "bg-card text-card-foreground  rounded-xl shadow-sm",
        "transition-colors",
        className
      )}
    >
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "block w-full text-left rounded-xl",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "hover:bg-muted/40 transition-colors"
        )}
      >
        {/* Question block */}
        <div className="p-5">
          {typeof question === "string" ? (
            <h3 className="text-base font-medium leading-relaxed text-pretty">
              {question}
            </h3>
          ) : (
            question
          )}

          {/* Divider above the arrow row */}
          <div className="divider my-1" />
        </div>

        {/* Arrow row at the bottom of the question block */}
        <div className="px-5 py-3">
          <div className="flex items-center justify-end">
            <ChevronDownIcon
              className={cn(
                "size-5 text-foreground/80 transition-transform",
                open ? "rotate-180" : "rotate-0"
              )}
            />
            <span className="sr-only">{open ? "Collapse" : "Expand"}</span>
          </div>
        </div>
      </button>

      {/* Collapsible content (answer) */}
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-300",
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-5 pt-0">{children}</div>
      </div>
    </article>
  );
}
