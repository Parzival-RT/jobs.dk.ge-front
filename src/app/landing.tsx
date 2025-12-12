"use client";
import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";

// Third Packages
import Select, { SingleValue } from "react-select";

// Store Imports
import { useLandingStore } from "@/store/landingStore";

// API Requests
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types
type RegionType = {
  value: string;
  label: string;
};
type ApiResponseRegionType = {
  id: number;
  text: string;
};
type SuperVipType = {
  id: number;
  CompanyDetail?: {
    logo?: string | null;
    brandname?: string;
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
};
type VipType = {
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
};
type CategoryType = {
  id: number;
  type: string;
  file: string;
  name: string;
  cnt: number;
};

export default function Landing() {
  const router = useRouter();

  //:::* Store States :::*//
  const loading = useLandingStore((state) => state.loading);
  const setLoading = useLandingStore((state) => state.setLoading);

  //:::* Component States :::*//
  const [regionOptions, setRegionOptions] = useState<RegionType[]>([]);
  const [superVip, setSuperVip] = useState<SuperVipType[]>([]);
  const [vip, setVip] = useState<VipType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [customCategories, setCustomCategories] = useState<CategoryType[]>([]);
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

  //:::* Handlers :::*//
  // const handleRegionChange = (selectedOption: SingleValue<RegionType>) => {
  //   setSelectedRegion(selectedOption);
  // };

  //:::* Functions :::*//
  const filterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push(
      `/JOBS?text=${filter.text}&region=${filter.region?.value || ""}&min=${
        filter.min
      }&max=${filter.max}`
    );
  };

  //:::* Hooks :::*//
  useEffect(() => {
    // Get Region Options Data
    const fetchData = async () => {
      setLoading(true);
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
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setLoading]);

  useEffect(() => {
    // Get Super Vip and Vip Vacancies
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.public.get("/public/vacancy/super_vip_list");

        setSuperVip(response.super_vip);
        setVip(response.vip);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setLoading]);

  useEffect(() => {
    // Get Super Vip and Vip Vacancies
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.public.get("/public/categories");
        setCategories(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [setLoading]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCustomCategories(() => {
        const updated = [...categories];

        // remove id:281
        const index = updated.findIndex((item) => item.id === 281);
        updated.splice(index, 1);

        const vip_vacancies = {
          id: 1000,
          name: "VIP ვაკანსიები",
          cnt: vip?.length,
          file: "https://v.dk.ge/VIPICON.png",
          type: "vip",
        };
        updated.unshift(vip_vacancies);

        const last = updated.pop();
        if (last) {
          updated.unshift(last);
        }
        return updated;
      });
    }
  }, [categories, vip]);

  useEffect(() => {
    // mount-ზე რაღაც გააკეთე...

    return () => {
      setCategories([]);
      setCustomCategories([]);
    };
  }, []);

  return (
    <>
      {!loading && (
        <div className="bg-gray-50 overflow-x-hidden">
          {/* Custom Styles */}
          <style jsx>
            {`
              @font-face {
                font-family: "FiraGO";
                src: local("FiraGO"), local("Fira Sans");
              }
              * {
                font-family: "FiraGO", "Fira Sans", sans-serif;
              }

              /* Custom animations */
              @keyframes float {
                0% {
                  transform: translateY(0px);
                }
                50% {
                  transform: translateY(-20px);
                }
                100% {
                  transform: translateY(0px);
                }
              }

              @keyframes slideInUp {
                from {
                  opacity: 0;
                  transform: translateY(30px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }

              .animate-float {
                animation: float 6s ease-in-out infinite;
              }

              .animate-slide-in {
                animation: slideInUp 0.6s ease-out;
              }

              /* Glassmorphism effect */
              .glass {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
              }

              /* Gradient text */
              .gradient-text {
                background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
            `}
          </style>

          {/* Hero Section with Modern Design */}
          <section className="pt-32 pb-20 px-4 relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 animate-slide-in">
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
                  შენი <span className="gradient-text">დასაქმების</span>
                  <br />
                  სააგენტო
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                  100+ ვაკანსია საქართველოს საუკეთესო კომპანიებიდან
                </p>
              </div>

              {/* Advanced Search Box */}
              <div
                className="max-w-7xl mx-auto animate-slide-in"
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
                              borderColor: state.isFocused
                                ? "#3b82f6"
                                : "#e5e7eb", // focus:border-blue-500 else border-gray-200
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
                  {/* <div className="flex flex-wrap gap-3 mt-6">
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
                  </div> */}
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">
                    10K+
                  </div>
                  <p className="text-gray-600">აქტიური ვაკანსია</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">
                    500+
                  </div>
                  <p className="text-gray-600">კომპანია</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">
                    50K+
                  </div>
                  <p className="text-gray-600">კანდიდატი</p>
                </div>
              </div>
            </div>
          </section>

          {/* Super Vip */}
          <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    SUPER VIP ვაკანსიები
                  </h2>
                  <p className="text-gray-600">
                    შენთვის შერჩეული საუკეთესო შესაძლებლობები
                  </p>
                </div>
                <Link
                  href="/JOBS"
                  className="text-blue-600 font-medium hover:text-blue-700 transition flex items-center gap-2"
                >
                  ყველას ნახვა
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
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Super Vip Job Card */}
                {superVip &&
                  superVip.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-400 hover:border-blue-200 hover:-translate-y-1"
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

              {!superVip && (
                <div className="flex flex-col items-center justify-center w-full space-y-4">
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

          {/* Categories with Icons */}
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  აირჩიე კატეგორია
                </h2>
                <p className="text-gray-600 text-lg">
                  იპოვე ვაკანსიები შენი სფეროდან
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {/* category card */}
                {customCategories &&
                  customCategories.map((item, index) => (
                    <Link
                      href={
                        item.id === 286
                          ? "https://network.dk.ge/GoldList"
                          : `/JOBS?type=${item.type}${
                              item.id ? `&id=${item.id}` : ""
                            }`
                      }
                      key={`${item.type}_${index}`}
                      className="group cursor-pointer"
                    >
                      <div
                        className={`bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full border ${
                          item.id === 286
                            ? "border-[#ffb800]"
                            : "border-neutral-300"
                        }`}
                      >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Image
                            className="w-16 h-16 rounded-xl object-contain"
                            src={item?.file || "/images/noavata.jpeg"}
                            width={64}
                            height={64}
                            alt="Company logo"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.cnt} ვაკანსია
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </section>

          {/* Vip */}
          <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    VIP ვაკანსიები
                  </h2>
                  <p className="text-gray-600">
                    შენთვის შერჩეული საუკეთესო შესაძლებლობები
                  </p>
                </div>
                <Link
                  href="/JOBS"
                  className="text-blue-600 font-medium hover:text-blue-700 transition flex items-center gap-2"
                >
                  ყველას ნახვა
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
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Vip Job Card */}
                {vip &&
                  vip.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-500 hover:border-blue-200 hover:-translate-y-1"
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

              {!vip && (
                <div className="flex flex-col items-center justify-center w-full space-y-4">
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

          {/* CTA Section */}
          <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold mb-4">
                    დაიწყე კარიერული ზრდა დღესვე!
                  </h2>
                  <p className="text-xl mb-8 opacity-90">
                    შეუერთდი 50,000+ კანდიდატს და იპოვე შენი ოცნების სამუშაო
                  </p>
                  {/* <div className="flex justify-center gap-4">
                    <a
                      href="#"
                      className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      დარეგისტრირდი უფასოდ
                    </a>
                    <a
                      href="#"
                      className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                    >
                      შეიტყვე მეტი
                    </a>
                  </div> */}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
