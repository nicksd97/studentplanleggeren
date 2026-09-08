"use client";

import { useState } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full divide-y divide-line">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`border-l-[3px] pl-5 pr-4 transition-colors duration-300 ${
              isOpen
                ? "border-l-brand-accent bg-surface"
                : "border-l-transparent hover:border-l-brand-accent/50"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="group flex w-full items-center justify-between gap-4 py-5 text-left cursor-pointer"
            >
              <span className="text-lg font-medium text-ink transition-colors group-hover:text-brand-accent">
                {item.question}
              </span>
              <svg
                className={`h-5 w-5 shrink-0 text-brand-accent transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              id={`faq-panel-${index}`}
              role="region"
              aria-hidden={!isOpen}
              inert={!isOpen}
              className={`overflow-hidden transition-all duration-300 ease-out ${
                isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="pr-6 text-ink-muted leading-relaxed sm:pr-10">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
