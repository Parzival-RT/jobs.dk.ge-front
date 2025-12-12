"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/auth";
import { useLandingStore } from "@/store/landingStore";
import Link from "next/link";
import Select, { SingleValue } from "react-select";
import { api } from "@/lib/api";
import ReactPaginate from "react-paginate";
import Image from "next/image";

interface UserProfile {
  name: string;
  mobile: string;
  email: string;
  cvFile: {
    name: string;
    uploadDate: string;
  } | null;
}

type RegionType = {
  value: string;
  label: string;
};

type ApiResponseRegionType = {
  id: number;
  text: string;
};

type SelectOptionType = {
  value: string;
  label: string;
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

const Profile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  const user = useAuth((state) => state.user);
  const hasHydrated = useAuth((state) => state._hasHydrated);
  const loading = useLandingStore((state) => state.loading);
  const setLoading = useLandingStore((state) => state.setLoading);

  //:::* Store States :::*//
  const [pagLoading, setPagLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(0);
  // const [totalItems, setTotalItems] = useState(0);

  //:::* Component States :::*//
  const [allVacancy, setAllVacancy] = useState<vacancyType[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    mobile: "",
    email: "",
    cvFile: null,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("tab1");
  const [isEditingFavorites, setIsEditingFavorites] = useState(false);

  // Filter states for Tab 2
  const [regionOptions, setRegionOptions] = useState<RegionType[]>([]);
  const [industryOptions, setIndustryOptions] = useState<SelectOptionType[]>(
    []
  );
  const [experienceOptions] = useState<SelectOptionType[]>([
    { value: "1", label: "გამოცდილების გარეშე" },
    { value: "2", label: "დამწყები" },
    { value: "3", label: "საშუალო დონე" },
    { value: "4", label: "პროფესიონალი" },
  ]);
  const [scheduleOptions] = useState<SelectOptionType[]>([
    { value: "1", label: "სრული განრიგი" },
    { value: "2", label: "ნახევრად განრიგი" },
    { value: "3", label: "დაშორებული" },
    { value: "4", label: "ჰიბრიდი" },
  ]);

  const [favoriteFilter, setFavoriteFilter] = useState<{
    region: SingleValue<RegionType>;
    industry: SingleValue<SelectOptionType>;
    experience: SingleValue<SelectOptionType>;
    schedule: SingleValue<SelectOptionType>;
    fixed_amount: string;
    min_bonus: string;
    max_bonus: string;
  }>({
    region: null,
    industry: null,
    experience: null,
    schedule: null,
    fixed_amount: "",
    min_bonus: "",
    max_bonus: "",
  });

  //:::* Load Profile from localStorage :::*//
  useEffect(() => {
    if (!hasHydrated) return;

    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }

    console.log("user in profile page:", user);

    // თუ user-ი არ არის, redirect-ი login-ზე
    if (!user) {
      router.push("/");
    }

    setLoading(false);
  }, [user, router, setLoading, hasHydrated]);

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
        const region = searchParams.get("region");
        const min = searchParams.get("min");
        const max = searchParams.get("max");

        const query = `&region=${region}&type=${type}&id=${id}&max=${max}&min=${min}`;
        const response = await api.public.get(
          `/public/vacancy/v2/search?page=${currentPage}${query}`
        );

        setAllVacancy(response.vacancy.data);
        setTotalPages(response.vacancy.last_page);
        // setTotalItems(response.vacancy.total);
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

  //:::* Load Region and Industry Options :::*//
  useEffect(() => {
    const fetchData = async () => {
      try {
        const regionResponse = await api.public.get(
          "/public/vacancy/LoadRegion"
        );
        if (regionResponse?.length) {
          const regionResult: RegionType[] = regionResponse.map(
            (item: ApiResponseRegionType) => ({
              value: item.id.toString(),
              label: item.text,
            })
          );
          setRegionOptions(regionResult);
        }

        // ინდუსტრიების მაგალითი (თუ API არის)
        try {
          const industryResponse = await api.public.get("/public/LoadSphere");
          if (industryResponse?.length) {
            const industryResult: SelectOptionType[] = industryResponse.map(
              (item: ApiResponseRegionType) => ({
                value: item.id.toString(),
                label: item.text,
              })
            );
            setIndustryOptions(industryResult);
          }
        } catch (error) {
          console.log(error);
          // თუ API არ არის, გამოიყენებთ mock data-ს
          setIndustryOptions([
            { value: "1", label: "IT / Software" },
            { value: "2", label: "Finance / Banking" },
            { value: "3", label: "Sales / Marketing" },
            { value: "4", label: "Education" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchData();
  }, []);

  //:::* Handle CV Upload :::*//
  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (PDF only)
      if (!file.type.includes("pdf")) {
        alert("გთხოვთ, აიტვირთოთ PDF ფაილი");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("ფაილი ძალიან დიდია (მაქსიმუმ 10MB)");
        return;
      }

      // Read file as base64 and save to localStorage
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        const updatedProfile = {
          ...profile,
          cvFile: {
            name: file.name,
            uploadDate: new Date().toLocaleDateString("ka-GE"),
          },
        };
        setProfile(updatedProfile);
        localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
        localStorage.setItem("userCV", base64String);
        setSuccessMessage("CV წარმატებით აიტვირთა!");
        setTimeout(() => setSuccessMessage(""), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  //:::* Handle CV Delete :::*//
  const handleDeleteCV = () => {
    if (confirm("ხართ დარწმუნებული, რომ გსურთ CV-ის წაშლა?")) {
      const updatedProfile = {
        ...profile,
        cvFile: null,
      };
      setProfile(updatedProfile);
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
      localStorage.removeItem("userCV");
      setSuccessMessage("CV წარმატებით წაიშალა!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {!loading && useAuth.getState().user && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 mt-20">
          {/* Header */}
          <div className="mb-8 max-w-7xl mx-auto">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
            >
              ← დაბრუნება მთავარზე
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ჩემი პროფილი
            </h1>
            <p className="text-gray-600">
              აქ ნახავთ თქვენს პირად ინფორმაციას და ვაკანსიებს სადაც უკვე
              გააგზავნეთ CV
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg max-w-7xl mx-auto">
              {successMessage}
            </div>
          )}

          {/* Main Card with Tabs */}
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <button
                onClick={() => setActiveTab("tab1")}
                className={`flex-1 min-w-fit py-4 px-4 sm:px-6 text-center font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "tab1"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                } cursor-pointer`}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="whitespace-nowrap text-sm sm:text-base">
                  ჩემი ინფორმაცია
                </span>
              </button>

              <button
                onClick={() => setActiveTab("tab2")}
                className={`flex-1 min-w-fit py-4 px-4 sm:px-6 text-center font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "tab2"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                } cursor-pointer`}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="whitespace-nowrap text-sm sm:text-base">
                  ჩემთვის სასურველი ვაკანსიები
                </span>
              </button>

              <button
                onClick={() => setActiveTab("tab3")}
                className={`flex-1 min-w-fit py-4 px-4 sm:px-6 text-center font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                  activeTab === "tab3"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                } cursor-pointer`}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="whitespace-nowrap text-sm sm:text-base">
                  ვაკანსიის ისტორია
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {/* Tab 1: ჩემი ინფორმაცია */}
              {activeTab === "tab1" && (
                <form className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    პირადი ინფორმაცია
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* First & Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        სახელი
                      </label>
                      <input
                        type="text"
                        value={user.name || ""}
                        disabled
                        className="w-full px-4 py-2 text-gray-900 font-medium bg-gray-100 rounded-lg border border-gray-300 cursor-not-allowed opacity-75"
                      />
                    </div>

                    {/* Mobile */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        მობილური
                      </label>
                      <input
                        type="text"
                        value={user.mobile || ""}
                        disabled
                        className="w-full px-4 py-2 text-gray-900 font-medium bg-gray-100 rounded-lg border border-gray-300 cursor-not-allowed opacity-75"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ელ.ფოსტა
                      </label>
                      <input
                        type="email"
                        value={user.email || ""}
                        disabled
                        className="w-full px-4 py-2 text-gray-900 font-medium bg-gray-100 rounded-lg border border-gray-300 cursor-not-allowed opacity-75"
                      />
                    </div>

                    {/* Password Change */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ახალი პაროლი
                      </label>
                      <input
                        type="password"
                        placeholder="შეიყვანეთ ახალი პაროლი"
                        className="w-full px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                      />
                    </div>
                  </div>

                  <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    რედაქტირება
                  </button>

                  {/* CV Upload Section */}
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    ჩემი CV
                  </h3>
                  <p className="text-gray-600 mb-6">
                    ატვირთული CV გამოყენებული იქნება ყველა ვაკანსიაზე, სადაც
                    გააგზავნით.
                  </p>

                  {profile.cvFile ? (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-slate-400 transition-colors bg-gray-50 shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            <svg
                              className="w-8 h-8 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M8.5 3.5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-7a1 1 0 1 1 2 0v7a4 4 0 0 1-4 4h-7a4 4 0 0 1-4-4v-10a4 4 0 0 1 4-4h4a1 1 0 1 1 0 2h-4z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {profile.cvFile.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              აიტვირთა: {profile.cvFile.uploadDate}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleDeleteCV}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium shadow"
                        >
                          წაშლა
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-slate-400 transition-colors bg-gray-50 shadow-md">
                      <div className="text-center py-6">
                        <svg
                          className="w-12 h-12 text-blue-600 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <p className="text-gray-600 mb-4">
                          ჯერ CV-ი არ არის ატვირთული
                        </p>
                        <label>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleCVUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={(e) =>
                              (
                                e.currentTarget
                                  .previousElementSibling as HTMLInputElement
                              )?.click()
                            }
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                          >
                            ატვირთეთ CV
                          </button>
                        </label>
                        <p className="text-xs text-gray-500 mt-3">
                          PDF ფაილი, მაქსიმუმ 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              )}

              {/* Tab 2: ჩემთვის სასურველი ვაკანსიები */}
              {activeTab === "tab2" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-8">
                    ჩემთვის სასურველი ვაკანსიები
                  </h2>

                  {/* Filter Form */}
                  <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        ფილტრი
                      </h3>
                      <button
                        onClick={() => {
                          if (
                            isEditingFavorites &&
                            (favoriteFilter.region ||
                              favoriteFilter.industry ||
                              favoriteFilter.experience ||
                              favoriteFilter.schedule ||
                              favoriteFilter.fixed_amount ||
                              favoriteFilter.min_bonus ||
                              favoriteFilter.max_bonus)
                          ) {
                            // Clear filters and exit edit mode
                            setFavoriteFilter({
                              region: null,
                              industry: null,
                              experience: null,
                              schedule: null,
                              fixed_amount: "",
                              min_bonus: "",
                              max_bonus: "",
                            });
                            setIsEditingFavorites(false);
                          } else if (!isEditingFavorites) {
                            // Enable edit mode
                            setIsEditingFavorites(true);
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isEditingFavorites &&
                        (favoriteFilter.region ||
                          favoriteFilter.industry ||
                          favoriteFilter.experience ||
                          favoriteFilter.schedule)
                          ? "გასუფთავება"
                          : "რედაქტირება"}
                      </button>
                    </div>

                    <div className="border border-gray-200 p-4 bg-white rounded-2xl w-full mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Region Select */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ადგილმდებარეობა
                          </label>
                          <Select
                            value={favoriteFilter.region}
                            onChange={(selectedOption) =>
                              setFavoriteFilter({
                                ...favoriteFilter,
                                region: selectedOption,
                              })
                            }
                            options={regionOptions}
                            placeholder="აირჩიე რეგიონი"
                            isClearable
                            isSearchable
                            isDisabled={!isEditingFavorites}
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                borderRadius: "0.75rem",
                                borderColor: state.isFocused
                                  ? "#3b82f6"
                                  : state.isDisabled
                                  ? "#d1d5db" // disabled border (gray-300)
                                  : "#e5e7eb",
                                boxShadow: "none",
                                minHeight: "40px",
                                backgroundColor: state.isDisabled
                                  ? "#e5e7eb"
                                  : "#ffffff", // disabled bg (gray-200)
                                cursor: state.isDisabled
                                  ? "not-allowed"
                                  : "pointer",
                                opacity: state.isDisabled ? 0.75 : 1,
                                "&:hover": {
                                  borderColor: state.isDisabled
                                    ? "#d1d5db"
                                    : "#3b82f6",
                                },
                              }),
                              placeholder: (base, state) => ({
                                ...base,
                                color: state.isDisabled ? "#6b7280" : "#9ca3af", // disabled text (gray-500)
                              }),
                              singleValue: (base, state) => ({
                                ...base,
                                color: state.isDisabled ? "#6b7280" : "#111827", // disabled text (gray-500)
                              }),
                              indicatorSeparator: () => ({ display: "none" }),
                              dropdownIndicator: (base, state) => ({
                                ...base,
                                color: state.isDisabled ? "#9ca3af" : "#6b7280",
                                "&:hover": {
                                  color: state.isDisabled
                                    ? "#9ca3af"
                                    : "#3b82f6",
                                },
                              }),
                            }}
                          />
                        </div>

                        {/* Industry Select */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            საქმიანობა
                          </label>
                          <Select
                            value={favoriteFilter.industry}
                            onChange={(selectedOption) =>
                              setFavoriteFilter({
                                ...favoriteFilter,
                                industry: selectedOption,
                              })
                            }
                            options={industryOptions}
                            placeholder="აირჩიე საქმიანობა"
                            isClearable
                            isSearchable
                            isDisabled={!isEditingFavorites}
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                borderRadius: "0.75rem",
                                borderColor: state.isFocused
                                  ? "#3b82f6"
                                  : state.isDisabled
                                  ? "#d1d5db" // disabled border (gray-300)
                                  : "#e5e7eb",
                                boxShadow: "none",
                                minHeight: "40px",
                                backgroundColor: state.isDisabled
                                  ? "#e5e7eb"
                                  : "#ffffff", // disabled bg (gray-200)
                                cursor: state.isDisabled
                                  ? "not-allowed"
                                  : "pointer",
                                opacity: state.isDisabled ? 0.75 : 1,
                                "&:hover": {
                                  borderColor: state.isDisabled
                                    ? "#d1d5db"
                                    : "#3b82f6",
                                },
                              }),
                              placeholder: (base, state) => ({
                                ...base,
                                color: state.isDisabled ? "#6b7280" : "#9ca3af", // disabled text (gray-500)
                              }),
                              singleValue: (base, state) => ({
                                ...base,
                                color: state.isDisabled ? "#6b7280" : "#111827", // disabled text (gray-500)
                              }),
                              indicatorSeparator: () => ({ display: "none" }),
                              dropdownIndicator: (base, state) => ({
                                ...base,
                                color: state.isDisabled ? "#9ca3af" : "#6b7280",
                                "&:hover": {
                                  color: state.isDisabled
                                    ? "#9ca3af"
                                    : "#3b82f6",
                                },
                              }),
                            }}
                          />
                        </div>

                        {/* Experience Select */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            გამოცდილება
                          </label>
                          <Select
                            value={favoriteFilter.experience}
                            onChange={(selectedOption) =>
                              setFavoriteFilter({
                                ...favoriteFilter,
                                experience: selectedOption,
                              })
                            }
                            options={experienceOptions}
                            placeholder="აირჩიე დონე"
                            isClearable
                            isDisabled={!isEditingFavorites}
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                borderRadius: "0.75rem",
                                borderColor: state.isFocused
                                  ? "#3b82f6"
                                  : state.isDisabled
                                  ? "#d1d5db" // disabled border (gray-300)
                                  : "#e5e7eb",
                                boxShadow: "none",
                                minHeight: "40px",
                                backgroundColor: state.isDisabled
                                  ? "#e5e7eb"
                                  : "#ffffff", // disabled bg (gray-200)
                                cursor: state.isDisabled
                                  ? "not-allowed"
                                  : "pointer",
                                opacity: state.isDisabled ? 0.75 : 1,
                                "&:hover": {
                                  borderColor: state.isDisabled
                                    ? "#d1d5db"
                                    : "#3b82f6",
                                },
                              }),
                              placeholder: (base, state) => ({
                                ...base,
                                color: state.isDisabled ? "#6b7280" : "#9ca3af", // disabled text (gray-500)
                              }),
                              singleValue: (base, state) => ({
                                ...base,
                                color: state.isDisabled ? "#6b7280" : "#111827", // disabled text (gray-500)
                              }),
                              indicatorSeparator: () => ({ display: "none" }),
                              dropdownIndicator: (base, state) => ({
                                ...base,
                                color: state.isDisabled ? "#9ca3af" : "#6b7280",
                                "&:hover": {
                                  color: state.isDisabled
                                    ? "#9ca3af"
                                    : "#3b82f6",
                                },
                              }),
                            }}
                          />
                        </div>

                        {/* Schedule Select */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            სამუშაო გრაფიკი
                          </label>
                          <Select
                            value={favoriteFilter.schedule}
                            onChange={(selectedOption) =>
                              setFavoriteFilter({
                                ...favoriteFilter,
                                schedule: selectedOption,
                              })
                            }
                            options={scheduleOptions}
                            placeholder="აირჩიე გრაფიკი"
                            isClearable
                            isDisabled={!isEditingFavorites}
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                borderRadius: "0.75rem",
                                borderColor: state.isFocused
                                  ? "#3b82f6"
                                  : state.isDisabled
                                  ? "#d1d5db" // disabled border (gray-300)
                                  : "#e5e7eb",
                                boxShadow: "none",
                                minHeight: "40px",
                                backgroundColor: state.isDisabled
                                  ? "#e5e7eb"
                                  : "#ffffff", // disabled bg (gray-200)
                                cursor: state.isDisabled
                                  ? "not-allowed"
                                  : "pointer",
                                opacity: state.isDisabled ? 0.75 : 1,
                                "&:hover": {
                                  borderColor: state.isDisabled
                                    ? "#d1d5db"
                                    : "#3b82f6",
                                },
                              }),
                              placeholder: (base, state) => ({
                                ...base,
                                color: state.isDisabled ? "#6b7280" : "#9ca3af", // disabled text (gray-500)
                              }),
                              singleValue: (base, state) => ({
                                ...base,
                                color: state.isDisabled ? "#6b7280" : "#111827", // disabled text (gray-500)
                              }),
                              indicatorSeparator: () => ({ display: "none" }),
                              dropdownIndicator: (base, state) => ({
                                ...base,
                                color: state.isDisabled ? "#9ca3af" : "#6b7280",
                                "&:hover": {
                                  color: state.isDisabled
                                    ? "#9ca3af"
                                    : "#3b82f6",
                                },
                              }),
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sallary */}
                    <div className="border border-gray-200 p-4 bg-white rounded-2xl w-full mt-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        ანაზღაურება
                      </h3>

                      <div className="mb-4">
                        <label
                          className="block text-sm font-medium text-gray-700 mb-2"
                          htmlFor="fixed_amount"
                        >
                          ფიქსირებული ხელფასი (ხელზე ასაღები)
                        </label>
                        <input
                          value={favoriteFilter.fixed_amount || ""}
                          onChange={(e) =>
                            setFavoriteFilter({
                              ...favoriteFilter,
                              fixed_amount: e.target.value,
                            })
                          }
                          id="fixed_amount"
                          type="text"
                          placeholder="ფიქსირებული ხელფასი"
                          className="w-full px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-300"
                          disabled={!isEditingFavorites}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="min_bonus"
                          >
                            მინ. საშუალო ბონუსი{" "}
                            <small className=" text-gray-500">
                              (გამომუშავებული თანხა) (ხელზე ასაღები)
                            </small>
                          </label>
                          <input
                            value={favoriteFilter.min_bonus || ""}
                            onChange={(e) =>
                              setFavoriteFilter({
                                ...favoriteFilter,
                                min_bonus: e.target.value,
                              })
                            }
                            id="min_bonus"
                            type="text"
                            placeholder="-დან"
                            className="w-full px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-300"
                            disabled={!isEditingFavorites}
                          />
                        </div>

                        <div className="mb-4">
                          <label
                            className="block text-sm font-medium text-gray-700 mb-2"
                            htmlFor="max_bonus"
                          >
                            მაქს. საშუალო ბონუსი{" "}
                            <small className=" text-gray-500">
                              (გამომუშავებული თანხა) (ხელზე ასაღები)
                            </small>
                          </label>
                          <input
                            value={favoriteFilter.max_bonus || ""}
                            onChange={(e) =>
                              setFavoriteFilter({
                                ...favoriteFilter,
                                max_bonus: e.target.value,
                              })
                            }
                            id="max_bonus"
                            type="text"
                            placeholder="-მდე"
                            className="w-full px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-300"
                            disabled={!isEditingFavorites}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4 lg:mb-0">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            საშუალოდ მინ. შემოსავალი თვეში
                          </label>
                          <input
                            value={
                              Number(favoriteFilter.fixed_amount) +
                                Number(favoriteFilter.min_bonus) || 0
                            }
                            type="text"
                            placeholder="მინ"
                            className="w-full px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-300"
                            disabled
                          />
                        </div>

                        <div className="mb-4 lg:mb-0">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            საშუალოდ მაქს. შემოსავალი თვეში
                          </label>
                          <input
                            value={
                              Number(favoriteFilter.fixed_amount) +
                                Number(favoriteFilter.max_bonus) || 0
                            }
                            type="text"
                            placeholder="მაქს"
                            className="w-full px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-300"
                            disabled
                          />
                        </div>
                      </div>
                    </div>

                    {isEditingFavorites &&
                      (favoriteFilter.region ||
                        favoriteFilter.industry ||
                        favoriteFilter.experience ||
                        favoriteFilter.schedule) && (
                        <button
                          onClick={() => {
                            console.log("Save filter:", favoriteFilter);
                            setSuccessMessage(
                              "პრიორიტეტები წარმატებით შენახეს!"
                            );
                            setIsEditingFavorites(false);
                            setTimeout(() => setSuccessMessage(""), 3000);
                            // TODO: api.post('/user/preferences', favoriteFilter)
                          }}
                          className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                        >
                          შენახვა
                        </button>
                      )}
                  </div>

                  {/* Vacancy Cards */}
                  <div className="space-y-4">
                    <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        ვებ დეველოპერი
                      </h3>
                      <p className="text-gray-600 mb-3">Google Georgia</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-medium">
                          3,500₾ - 4,500₾
                        </span>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                          ნახვა
                        </button>
                      </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        UI/UX დიზაინერი
                      </h3>
                      <p className="text-gray-600 mb-3">Figma Studio</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-medium">
                          2,500₾ - 3,500₾
                        </span>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                          ნახვა
                        </button>
                      </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        ბაზა ადმინისტრატორი
                      </h3>
                      <p className="text-gray-600 mb-3">TechHub Georgia</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-medium">
                          4,000₾ - 5,500₾
                        </span>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                          ნახვა
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: ვაკანსიის ისტორია */}
              {activeTab === "tab3" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    CV გაგზავნის ისტორია
                  </h2>

                  {/* CV Submission History */}
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
                              {item.work_experience == "3"
                                ? "საშუალო დონე"
                                : ""}
                              {item.work_experience == "4"
                                ? "პროფესიონალი"
                                : ""}
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
                          <p className="text-sm text-gray-500">
                            გთხოვთ მოითმინოთ
                          </p>
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

                  {/* Pagination */}
                  {!loading && totalPages > 1 && (
                    <div className="flex flex-col items-center space-y-4 mt-30 mb-10">
                      {/* Results Info */}
                      {/* <div className="text-sm text-gray-600">
                        გვერდი {currentPage} / {totalPages} - სულ {totalItems}{" "}
                        შედეგი
                      </div> */}

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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
