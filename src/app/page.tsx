import type { Metadata } from "next";

// Component Imports
import Landing from "./landing";

export const metadata: Metadata = {
  title: "შენი დასაქმების სააგენტო",
  description: "საუკეთესო ვაკანსიები მარტივად და სწრაფად",
};

export default function Home() {
  return (
    <>
      <Landing />
    </>
  );
}
