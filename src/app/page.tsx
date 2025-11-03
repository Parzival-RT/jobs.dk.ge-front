import type { Metadata } from "next";

// Component Imports
import Landing from "./landing";

export const metadata: Metadata = {
  title: "უბრალოდ კარგი ვაკანსიები",
  description: "საუკეთესო ვაკანსიები მარტივად და სწრაფად",
};

export default function Home() {
  return (
    <>
      <Landing />
    </>
  );
}
