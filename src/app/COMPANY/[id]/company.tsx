"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

// Third Packages

// API Requests
import { api } from "@/lib/api";
import { useSearchParams } from "next/navigation";

// Store Imports
import { useLandingStore } from "@/store/landingStore";
import Link from "next/link";

// Types and Interface
type PageProps = {
  params: {
    value: string;
  };
};
type vacancyType = {
  id: number;
  CompanyDetail?: {
    logo?: string | null;
    brandname?: string;
  };
  position?: {
    name?: string | null;
  };
  IndustryDetail?: {
    text?: string | null;
  };
  work_experience: string | null;
  work_schedule: {
    name: string | null;
  };
  VacancyLocation: {
    name: string | null;
  };
  amount_type: string | number;
  avarage_min_bonus: string | number;
  avarage_max_bonus: string | number;
  CurrencyDetail: {
    text: string | null;
  };
  min_amount: string | number;
  max_amount: string | number;
  fixed_amount: string | number;
  super_vip_status: string | number;
  vip_status: string | number;
};
type companyType = {
  company_logo: string;
  brandname: string;
  cnt: number;
  facebook: string;
  website: string;
};

const Company = ({ params }: PageProps) => {
  // const router = useRouter();
  const searchParams = useSearchParams();

  //:::* Store States :::*//
  const loading = useLandingStore((state) => state.loading);
  const setLoading = useLandingStore((state) => state.setLoading);

  //:::* Component States :::*//
  const [allVacancy, setAllVacancy] = useState<vacancyType[]>([]);
  const [companyDetail, setCompanyDetail] = useState<companyType | null>(null);

  //:::* Functions :::*//

  //:::* Hooks :::*//
  useEffect(() => {
    const fetchData = async () => {
      // if (isInitialMount.current) {
      //   setLoading(true);
      // }

      try {
        const parsedValue = JSON.parse(params.value);
        const paramsId = parsedValue.id;

        const response = await api.public.get(
          `/public/get_vacancy_by_detail/${paramsId}`
        );
        setAllVacancy(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // if (isInitialMount.current) {
        //   setLoading(false);
        //   isInitialMount.current = false;
        // }
        // setPagLoading(false);
      }
    };

    fetchData();
  }, [params, setLoading, searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const parsedValue = JSON.parse(params.value);
        const id = parsedValue.id;

        // console.log(id);
        if (params?.value) {
          const response = await api.public.get(
            `/public/get_company_by_id/${id}`
          );

          setCompanyDetail(response);

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params, setLoading]);

  return (
    <>
      <div className="bg-gray-50 overflow-x-hidden">
        {/* Advanced Search Box */}
        {!loading && (
          <div
            className="max-w-7xl mx-auto animate-slide-in mt-30 mb-20"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <Image
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                    src={
                      (companyDetail && companyDetail?.company_logo) ||
                      "/images/noavata.jpeg"
                    }
                    width={64}
                    height={64}
                    alt="Company logo"
                  />

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {companyDetail?.brandname || "Loading..."}
                    </h3>
                    <p className="text-gray-500 text-sm mb-1">
                      ვაკანსია: {companyDetail?.cnt}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {/* Facebook Icon */}
                  {companyDetail?.facebook && (
                    <a
                      href={companyDetail?.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <circle cx="16" cy="16" r="16" fill="#EDEDED" />
                        <path
                          d="M14 13.3333H12V16H14V24H17.3333V16H19.7333L20 13.3333H17.3333V12.2C17.3333 11.6 17.4667 11.3333 18.0667 11.3333H20V8H17.4667C15.0667 8 14 9.06667 14 11.0667V13.3333Z"
                          fill="#424242"
                        />
                      </svg>
                    </a>
                  )}

                  {/* Website Icon */}
                  {companyDetail && companyDetail?.website && (
                    <a
                      href={companyDetail && companyDetail?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="hover:opacity-80 transition-opacity"
                      >
                        <circle cx="16" cy="16" r="16" fill="#EDEDED" />
                        <circle cx="16" cy="16" r="7.5" stroke="#424242" />
                        <path
                          d="M18.5 16C18.5 18.1651 18.1701 20.1029 17.6532 21.4813C17.394 22.1723 17.0975 22.6969 16.7936 23.0396C16.4892 23.383 16.2199 23.5 16 23.5C15.7801 23.5 15.5108 23.383 15.2064 23.0396C14.9025 22.6969 14.606 22.1723 14.3468 21.4813C13.8299 20.1029 13.5 18.1651 13.5 16C13.5 13.8349 13.8299 11.8971 14.3468 10.5187C14.606 9.82765 14.9025 9.30314 15.2064 8.96038C15.5108 8.61704 15.7801 8.5 16 8.5C16.2199 8.5 16.4892 8.61704 16.7936 8.96038C17.0975 9.30314 17.394 9.82765 17.6532 10.5187C18.1701 11.8971 18.5 13.8349 18.5 16Z"
                          stroke="#424242"
                        />
                        <path
                          d="M8.5 16H23.5"
                          stroke="#424242"
                          strokeLinecap="round"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Vacancy Cards */}
        {!loading && (
          <section className=" px-4 bg-gradient-to-b from-white to-gray-50 mb-20">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Vip Job Card */}
                {allVacancy &&
                  allVacancy.map((item) => (
                    <Link
                      href={`/JOB/${item.id}`}
                      key={item.id}
                      className={`group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border 
                              ${
                                item.super_vip_status === "active"
                                  ? "border-amber-500"
                                  : item.vip_status === "active"
                                  ? "border-blue-500"
                                  : "border-gray-200"
                              } 
                              hover:border-blue-200 hover:-translate-y-1`}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <Image
                          className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                          src={
                            item?.CompanyDetail?.logo || "/images/noavata.jpeg"
                          }
                          width={64}
                          height={64}
                          alt="Company logo"
                        />

                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                            {item?.position?.name}
                          </h3>
                          <p className="text-gray-500 text-sm items-center gap-2">
                            {item?.IndustryDetail?.text}
                          </p>
                          <span className="text-blue-700 text-sm items-center gap-2">
                            {item?.CompanyDetail?.brandname}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm">
                          {item.work_experience == "1"
                            ? "გამოცდილების გარეშე"
                            : ""}
                          {item.work_experience == "2" ? "დამწყები" : ""}
                          {item.work_experience == "3" ? "საშუალო დონე" : ""}
                          {item.work_experience == "4" ? "პროფესიონალი" : ""}
                        </span>

                        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm">
                          {item.work_schedule.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div>
                          {/* <p className="text-2xl font-bold text-gray-900">
                                  ₾5,000-7,000
                                </p> */}
                          <p className="text-2xl font-bold text-gray-900">
                            {item.amount_type === 1 && (
                              <>
                                {Number(
                                  item.avarage_min_bonus
                                ).toLocaleString()}
                                {item.CurrencyDetail.text} -{" "}
                                {Number(
                                  item.avarage_max_bonus
                                ).toLocaleString()}
                                {item.CurrencyDetail.text}
                              </>
                            )}

                            {item.amount_type === 2 && (
                              <>
                                {Number(item.min_amount).toLocaleString()}
                                {item.CurrencyDetail.text} -{" "}
                                {Number(item.max_amount).toLocaleString()}
                                {item.CurrencyDetail.text}
                              </>
                            )}

                            {item.amount_type === 3 && (
                              <>
                                {Number(item.fixed_amount).toLocaleString()}
                                {item.CurrencyDetail.text}
                              </>
                            )}
                          </p>

                          <p className="text-sm text-gray-500">თვეში</p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            ></path>
                          </svg>
                          {item.VacancyLocation.name}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>

              {!allVacancy && (
                <div className="flex flex-col items-center justify-center w-full space-y-4 py-20">
                  {/* Spinner */}
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-400 rounded-full animate-spin animation-delay-150"></div>
                  </div>

                  {/* Loading Text */}
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">
                      იტვირთება...
                    </h2>
                    <p className="text-sm text-gray-500">გთხოვთ მოითმინოთ</p>
                  </div>

                  {/* Animated Dots */}
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Company;
