"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

// Store Imports
import { useLandingStore } from "@/store/landingStore";

// Component Imports
import Accordion from "@/components/ui/Accordion";

interface FAQItem {
  id: string;
  title: string;
  content: string;
}

interface ApiResponseItem {
  id: number;
  name: string;
  desc: string;
  // Add other fields from your API response here
}

const Faq = () => {
  //:::* Store States :::*//
  const loading = useLandingStore((state) => state.loading);
  const setLoading = useLandingStore((state) => state.setLoading);

  //:::* Component States :::*//
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);

  //:::* Hooks :::*//
  useEffect(() => {
    // Get FAQ Data
    const fetchData = async () => {
      setLoading(true);
      try {
        const faqResult = await api.public.get("/auth/RegGroup/loadData");

        if (faqResult.data?.length) {
          const faqArray: FAQItem[] = faqResult.data.map(
            (item: ApiResponseItem) => ({
              id: item.id.toString(),
              title: item.name,
              content: item.desc,
            })
          );

          setFaqItems(faqArray);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setLoading]);

  return (
    <>
      {!loading && (
        <div>
          <div className="p-8 my-36">
            <h1 className="text-2xl font-bold mb-6">ხშირად დასმული კითხვები</h1>
            <Accordion items={faqItems} />
            <Link
              href="/Register"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 mt-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>

              <span>რეგისტრაცია</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Faq;
