import React from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ხშირად დასმული კითხვები",
  description: "საუკეთესო ვაკანსიები მარტივად და სწრაფად",
};

// Component Imports
import Faq from "./faq";

export default function Page() {
  return <Faq />;
}
