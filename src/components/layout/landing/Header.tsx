import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
// Hooks
import { useState, useRef, useEffect } from "react";

import { useAuth } from "@/store/auth";

export default function Header() {
  const router = useRouter();
  //:::* States :::*//
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const { clearUser } = useAuth();

  const logout = () => {
    router.push(`/`);
    clearUser();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
  const toggleMenu = () => setOpen(!open);
  return (
    <>
      <header className="fixed w-full top-0 z-50 bg-white border-b border-gray-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-12">
              <Link
                href="/"
                className="hidden visib none lg:flex items-center space-x-2"
              >
                <Image
                  priority
                  src="/images/jobs_logo.svg"
                  width={200}
                  height={60}
                  alt="logo"
                />
              </Link>
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
              <div className="hidden lg:flex items-center space-x-8">
                <Link
                  href="/"
                  className="hidden sm:block text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  მთავარი
                </Link>
                <Link
                  href="/FAQ"
                  className="hidden sm:block text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  ხდკ
                </Link>
                <Link
                  href="#contact"
                  className="hidden sm:block text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  კონტაქტი
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!useAuth.getState().user && (
                <Link
                  href="/USER/SIGNIN"
                  className="hidden sm:block text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  შესვლა
                </Link>
              )}
              {!useAuth.getState().user ? (
                <Link
                  href="/USER"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="hidden md:inline-block">რეგისტრაცია</span>
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
              ) : (
                <div ref={ref} className="relative inline-block text-left">
                  {/* Circle with first letter */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMenu}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg hover:shadow-lg transition cursor-pointer"
                    >
                      {useAuth.getState().user?.name?.charAt(0).toUpperCase() ||
                        "U"}
                    </button>
                    <div
                      onClick={toggleMenu}
                      className="flex flex-col justify-center cursor-pointer"
                    >
                      <div className="flex items-center">
                        <p className="text-gray-900 font-semibold">
                          {useAuth.getState().user?.name || "User"}
                        </p>
                        {/* Down arrow indicating dropdown */}
                        <svg
                          className={`w-4 h-4 ml-2 text-gray-500 transform transition-transform duration-200 ${
                            open ? "rotate-180" : "rotate-0"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {useAuth.getState().user?.email || ""}
                      </p>
                    </div>
                  </div>

                  {/* Dropdown menu */}
                  {open && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="text-gray-900 font-semibold">
                          {useAuth.getState().user?.name || "User"}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {useAuth.getState().user?.email || ""}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <ul className="py-2">
                        <li>
                          <Link
                            href="/USER/PROFILE"
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
                          >
                            <svg
                              className="w-5 h-5 mr-3 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            პროფილი
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={logout}
                            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition"
                          >
                            <svg
                              className="w-5 h-5 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            გასვლა
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
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
              <Link
                href="/"
                className=" text-gray-700 hover:text-blue-600 font-medium transition"
              >
                მთავარი
              </Link>
              <Link
                href="/FAQ"
                className=" text-gray-700 hover:text-blue-600 font-medium transition"
              >
                ხდკ
              </Link>
              <Link
                href="#contact"
                className=" text-gray-700 hover:text-blue-600 font-medium transition"
              >
                კონტაქტი
              </Link>

              {!useAuth.getState().user && (
                <div className="flex flex-col gap-1">
                  <Link
                    href="/USER/SIGNIN"
                    className="bg-gradient-to-r from-transparent hover:border  px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center"
                  >
                    <span>შესვლა</span>
                  </Link>
                  <Link
                    href="/USER"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center"
                  >
                    <span>რეგისტრაცია</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
