"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Store Imports
import { useLandingStore } from "@/store/landingStore";
// Store Imports
import { useAuth } from "@/store/auth";
export default function RegistrationChoice() {
  const router = useRouter();

  //:::* Store States :::*//
  const loading = useLandingStore((state) => state.loading);
  const setLoading = useLandingStore((state) => state.setLoading);

  //:::* Hooks :::*//
  useEffect(() => {
    if (useAuth.getState().user) {
      router.push(`/`);
    }

    setLoading(false);
  }, [setLoading, router]);
  return (
    <>
      {!loading && !useAuth.getState().user && (
        <div className="flex h-full lg:h-screen bg-gray-50 pt-32 lg:pt-0 lg:mt-20 mb-20 lg:mb-0">
          <div className="hidden lg:block lg:w-1/2 relative h-full">
            <Image
              priority
              src="/images/signup_cover_main.jpg"
              alt="Login Cover Image"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-10 ">
            <div className="bg-white shadow-lg p-3 py-10 lg:p-10 rounded-3xl flex flex-col items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                რეგისტრაცია
              </h1>

              <div className="flex flex-col gap-5 mt-8">
                {/* ::: Applicant (განმცხადებელი) ::: */}
                <Link
                  href="/USER/SIGNUP"
                  // გაუმჯობესებული დიზაინი: უფრო მეტი padding, მკვეთრი ჩრდილი, ლურჯი hover ეფექტი
                  className="group w-full p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center gap-6 transform hover:scale-[1.02]"
                >
                  {/* აიკონის კონტეინერი */}
                  <div className="p-3 bg-blue-500 rounded-xl shadow-md transition-colors duration-300 group-hover:bg-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="white" // აიკონის ფერი თეთრი
                      className="w-7 h-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"
                      />
                    </svg>
                  </div>
                  {/* ტექსტის კონტეინერი */}
                  <div className="flex flex-col text-left">
                    <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition duration-300">
                      გააგზავნე CV
                    </span>
                    <span className="text-sm text-gray-500 mt-0.5">
                      გამოაგზავნე შენი CV მარტივად
                    </span>
                  </div>
                </Link>

                {/* ::: Company (კომპანია) ::: */}
                <Link
                  href="https://www.app.dk.ge/Signup"
                  // გაუმჯობესებული დიზაინი: უფრო მეტი padding, მკვეთრი ჩრდილი, ლურჯი hover ეფექტი
                  className="group w-full p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center gap-6 transform hover:scale-[1.02]"
                >
                  {/* აიკონის კონტეინერი */}
                  <div className="p-3 bg-blue-500 rounded-xl shadow-md transition-colors duration-300 group-hover:bg-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="white" // აიკონის ფერი თეთრი
                      className="w-7 h-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 21h16.5M4.5 3.75h15a.75.75 0 01.75.75v15.75H3.75V4.5a.75.75 0 01.75-.75z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 8.25h.008v.008H9V8.25zm0 3h.008v.008H9v-.008zm0 3h.008v.008H9v-.008zm3-6h.008v.008H12V8.25zm0 3h.008v.008H12v-.008zm0 3h.008v.008H12v-.008zm3-6h.008v.008H15V8.25zm0 3h.008v.008H15v-.008zm0 3h.008v.008H15v-.008z"
                      />
                    </svg>
                  </div>
                  {/* ტექსტის კონტეინერი */}
                  <div className="flex flex-col text-left">
                    <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition duration-300">
                      კომპანია
                    </span>
                    <span className="text-sm text-gray-500 mt-0.5">
                      ვაკანსიების დამატება და მართვა
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
