"use client";

import { useState } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-[640px] mx-auto divide-y divide-brand-soft">
      {items.map((item, index) => (
        <div 
          key={index}
          className={`border-l-[3px] transition-colors duration-300 pl-4 ${
            openIndex === index 
              ? "border-brand-accent bg-brand-pale/10" 
              : "border-transparent hover:border-brand-accent/50"
          }`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="flex w-full items-center justify-between py-5 text-left cursor-pointer group"
          >
            <span className="font-bold text-brand-dark pr-4 group-hover:text-brand-medium transition-colors">
              {item.question}
            </span>
            <svg
              className={`h-5 w-5 shrink-0 text-brand-medium transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              openIndex === index ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <p className="text-brand-medium text-sm leading-relaxed">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
