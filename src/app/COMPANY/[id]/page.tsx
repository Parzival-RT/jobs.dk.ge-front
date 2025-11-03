import React from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ვაკანსიები",
  description: "საუკეთესო ვაკანსიები მარტივად და სწრაფად",
};

// Component Imports
import Company from "./company";

type PageProps = {
  params: {
    value: string;
  };
};

export default function Page({ params }: PageProps) {
  return <Company params={params} />;
}
