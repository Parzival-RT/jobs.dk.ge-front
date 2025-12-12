import React from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ვაკანსიები",
  description: "საუკეთესო ვაკანსიები მარტივად და სწრაფად",
};

// Component Imports
import Register from "./register";

export default function Page() {
  return <Register />;
}
