"use client";
import React, { useEffect, useState, FormEvent, useRef } from "react";
import Image from "next/image";
import ReactPaginate from "react-paginate";

// Third Packages
import Select, { SingleValue } from "react-select";

// API Requests
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

// Store Imports
import { useLandingStore } from "@/store/landingStore";
import Link from "next/link";

// Types
type RegionType = {
  value: string;
  label: string;
};
type ApiResponseRegionType = {
  id: number;
  text: string;
};
type vacancyType = {
  id: number;
  CompanyDetail?: {
    logo?: string | null;
    brandname?: string | null;
    id: number | string | null;
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

const Jobs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  //:::* Store States :::*//
  const loading = useLandingStore((state) => state.loading);
  const [pagLoading, setPagLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const setLoading = useLandingStore((state) => state.setLoading);

  //:::* Component States :::*//
  const [allVacancy, setAllVacancy] = useState<vacancyType[]>([]);
  const [regionOptions, setRegionOptions] = useState<RegionType[]>([]);
  const [filter, setFilter] = useState<{
    text: string;
    region: SingleValue<RegionType>;
    min: string;
    max: string;
  }>({
    text: "",
    region: null,
    min: "",
    max: "",
  });

  //:::* Functions :::*//
  const filterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push(
      `/JOBS?text=${filter.text}&region=${filter.region?.value}&min=${filter.min}&max=${filter.max}`
    );
  };

  // Pagination handler
  const handlePageClick = (event: { selected: number }) => {
    setPagLoading(true);
    setAllVacancy([]);

    const selectedPage = event.selected + 1;
    setCurrentPage(selectedPage);

    const currentParams = Object.fromEntries(searchParams.entries());

    const updatedParams = {
      ...currentParams,
      page: selectedPage.toString(),
    };

    const queryString = new URLSearchParams(updatedParams).toString();

    router.push(`/JOBS?${queryString}`);
  };

  //:::* Hooks :::*//
  useEffect(() => {
    const fetchData = async () => {
      if (isInitialMount.current) {
        setLoading(true);
      }

      try {
        const type = searchParams.get("type");
        const id = searchParams.get("id");

        const query = `&type=${type}&id=${id}`;
        const response = await api.public.get(
          `/public/vacancy/v2/search?page=${currentPage}${query}`
        );

        setAllVacancy(response.vacancy.data);
        setTotalPages(response.vacancy.last_page);
        setTotalItems(response.vacancy.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isInitialMount.current) {
          setLoading(false);
          isInitialMount.current = false;
        }
        setPagLoading(false);
      }
    };

    fetchData();
  }, [currentPage, setLoading, searchParams]);

  useEffect(() => {
    // Get Region Options Data
    const fetchData = async () => {
      // setLoading(true);
      try {
        const response = await api.public.get("/public/vacancy/LoadRegion");

        if (response?.length) {
          const regionResult: RegionType[] = response.map(
            (item: ApiResponseRegionType) => ({
              value: item.id.toString(),
              label: item.text,
            })
          );

          setRegionOptions(regionResult);
          window.scrollTo(0, 0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setLoading]);

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
              <form
                onSubmit={filterSubmit}
                className="flex flex-col md:flex-row align-center gap-4"
              >
                <div className="grid md:grid-cols-12 gap-4 w-full">
                  <div className="md:col-span-4 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                      </svg>
                    </div>
                    <input
                      value={filter.text}
                      onChange={(e) =>
                        setFilter({ ...filter, text: e.target.value })
                      }
                      type="text"
                      placeholder="პოზიცია, სიტყვა ან კომპანია"
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-4 relative">
                    {/* Icon */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>

                    {/* Select */}
                    <Select
                      value={filter.region}
                      onChange={(selectedOption) =>
                        setFilter({ ...filter, region: selectedOption })
                      }
                      options={regionOptions}
                      placeholder="აირჩიე რეგიონი"
                      isClearable
                      isSearchable
                      name="region"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderRadius: "0.75rem", // Tailwind-ის equivalent: rounded-xl
                          borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb", // focus:border-blue-500 else border-gray-200
                          boxShadow: "none",
                          minHeight: "56px",
                          paddingLeft: "3rem", // pl-12 space აიკონისთვის
                          paddingRight: "1rem",
                          "&:hover": {
                            borderColor: "#3b82f6",
                          },
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#9ca3af", // text-gray-400
                        }),
                        indicatorSeparator: () => ({ display: "none" }),
                      }}
                    />
                  </div>
                  <div className="md:col-span-4 relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </div>
                    <div className="flex align-center">
                      <input
                        value={filter.min}
                        onChange={(e) =>
                          setFilter({ ...filter, min: e.target.value })
                        }
                        type="text"
                        placeholder="მინ"
                        className="w-full pl-12 pr-4 py-4 rounded-s-xl border border-e-0 focus:border-e border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
                      />
                      <input
                        value={filter.max}
                        onChange={(e) =>
                          setFilter({ ...filter, max: e.target.value })
                        }
                        type="text"
                        placeholder="მდე"
                        className="w-full pl-12 pr-4 py-4 rounded-e-xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer w-full md:w-36 flex align-center justify-center [&>svg]:me-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  ძებნა
                </button>
              </form>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all hover:scale-105">
                  <span className="mr-2">🏠</span> Remote
                </button>
                <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all hover:scale-105">
                  <span className="mr-2">💰</span> ₾3000+
                </button>
                <button className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-all hover:scale-105">
                  <span className="mr-2">🎓</span> Junior Friendly
                </button>
                <button className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-all hover:scale-105">
                  <span className="mr-2">⚡</span> სასწრაფო
                </button>
              </div>
            </div>
          </div>
        )}

        {/* All Vacancy Cards */}
        {!loading && (
          <section className=" px-4 bg-gradient-to-b from-white to-gray-50 mb-20 pt-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Vip Job Card */}
                {allVacancy &&
                  allVacancy.map((item) => (
                    <div
                      key={item.id}
                      className={`group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border 
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
                        <Link href={`/JOB/${item.id}`}>
                          <Image
                            className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                            src={
                              item?.CompanyDetail?.logo ||
                              "/images/noavata.jpeg"
                            }
                            width={64}
                            height={64}
                            alt="Company logo"
                          />
                        </Link>

                        <div>
                          <Link href={`/JOB/${item.id}`}>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                              {item?.position?.name}
                            </h3>
                            <p className="text-gray-500 text-sm items-center gap-2">
                              {item?.IndustryDetail?.text}
                            </p>
                          </Link>
                          <Link
                            href={`/COMPANY/${item?.CompanyDetail?.id}`}
                            className="text-blue-700 text-sm items-center gap-2"
                          >
                            {item?.CompanyDetail?.brandname}
                          </Link>
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
                    </div>
                  ))}
              </div>

              {(!allVacancy || pagLoading) && (
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

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col items-center space-y-4 mb-30">
            {/* Results Info */}
            <div className="text-sm text-gray-600">
              გვერდი {currentPage} / {totalPages} - სულ {totalItems} შედეგი
            </div>

            {/* Pagination Component */}
            <ReactPaginate
              breakLabel="..."
              nextLabel={
                <span className="flex items-center">
                  შემდეგი
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              }
              previousLabel={
                <span className="flex items-center">
                  <svg
                    className="mr-1 w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  წინა
                </span>
              }
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              pageCount={totalPages}
              forcePage={currentPage - 1} // 0-based indexing
              containerClassName="flex items-center space-x-1"
              // Tailwind Classes
              pageClassName="relative inline-flex items-center"
              pageLinkClassName="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 rounded-md transition-colors duration-200"
              previousClassName="relative inline-flex items-center"
              previousLinkClassName="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 rounded-l-md transition-colors duration-200"
              nextClassName="relative inline-flex items-center"
              nextLinkClassName="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 rounded-r-md transition-colors duration-200"
              activeClassName="z-10 bg-blue-600 border-blue-600"
              activeLinkClassName="!text-white !bg-blue-600 !border-blue-600"
              disabledClassName="opacity-50 cursor-not-allowed"
              disabledLinkClassName="!cursor-not-allowed !opacity-50 hover:!bg-white hover:!text-gray-500"
              breakClassName="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Jobs;
