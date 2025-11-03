"use client";

import { useState } from "react";

// Component Imports
import HtmlRenderer from "./HtmlRenderer";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

const Accordion = ({ items }: AccordionProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="w-full mx-auto">
      {items.map((item) => (
        <div
          key={item.id}
          className="mb-2 border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            className={`w-full p-4 text-left font-medium flex justify-between items-center transition-colors ${
              activeId === item.id
                ? "bg-blue-50 text-blue-600"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => toggleItem(item.id)}
          >
            <span>{item.title}</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                activeId === item.id ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            className={`overflow-auto flex-inline transition-all duration-700 ${
              activeId === item.id ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="p-4 bg-white border-t border-gray-100">
              <HtmlRenderer content={item.content} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
