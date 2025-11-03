import Image from "next/image";
import Link from "next/link";
// Hooks
import { useState } from "react";

export default function Header() {
  //:::* States :::*//
  // Mobile Menu Toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const openMenu = () => {
    setShowMenu(true);
    setTimeout(() => setMobileMenuOpen(true), 10);
  };
  const closeMenu = () => {
    setMobileMenuOpen(false); // first trigger animation
    setTimeout(() => setShowMenu(false), 300); // hide DOM after animation
  };
  return (
    <>
      <header className="fixed w-full top-0 z-50 bg-white border-b border-gray-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-12">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  priority
                  src="/images/jobs_logo.svg"
                  width={250}
                  height={60}
                  alt="logo"
                />
              </Link>
              <div className="hidden lg:flex items-center space-x-8">
                <Link
                  href="#"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all hover:scale-105"
                >
                  უძრავი ქონება
                </Link>
                <Link
                  href="https://academy.dk.ge/"
                  target="_blank"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-all hover:scale-105"
                >
                  აკადემია
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition lg:hidden cursor-pointer"
                onClick={openMenu}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <Link
                href="#"
                className="hidden sm:block text-gray-700 hover:text-blue-600 font-medium transition"
              >
                შესვლა
              </Link>
              <Link
                href="/FAQ"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="hidden md:inline-block">
                  განათავსე ვაკანსია
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6 md:hidden"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu with Transition */}
      {showMenu && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-50 bg-[#00000088]  backdrop-blur-sm flex justify-end lg:hidden"
        >
          <div
            className={`
                bg-white w-4/5 max-w-sm h-full p-6 transform transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
                `}
          >
            <div className="flex justify-between items-center mb-6">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  priority
                  src="/images/jobs_logo.svg"
                  width={150}
                  height={50}
                  alt="logo"
                />
              </Link>
              <button
                onClick={closeMenu}
                className="text-gray-700 hover:text-red-500 transition cursor-pointer"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col space-y-6 text-lg font-medium text-gray-800">
              <Link href="/company" className="hover:text-blue-600">
                კომპანიები
              </Link>
              <Link
                href="https://academy.dk.ge/"
                target="_blank"
                className="hover:text-blue-600"
              >
                აკადემია
              </Link>
              <Link
                href="#"
                className="mt-4 mb-2 py-3 rounded-xl border text-center"
              >
                შესვლა
              </Link>
              <Link
                href="/FAQ"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center"
              >
                <span>განათავსე ვაკანსია</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
