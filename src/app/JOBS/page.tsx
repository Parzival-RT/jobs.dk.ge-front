import React from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ვაკანსიები",
  description: "საუკეთესო ვაკანსიები მარტივად და სწრაფად",
};

// Component Imports
import Jobs from "./jobs";

export default function Page() {
  return <Jobs />;
}
