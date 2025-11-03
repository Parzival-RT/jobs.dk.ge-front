import React from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ვაკანსიები",
  description: "საუკეთესო ვაკანსიები მარტივად და სწრაფად",
};

// Component Imports
import Job from "./job";

type PageProps = {
  params: {
    value: string;
  };
};

export default function Page({ params }: PageProps) {
  return <Job params={params} />;
}
