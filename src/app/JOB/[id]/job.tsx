"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
// import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

// Third Packages
// import Select, { SingleValue } from "react-select";

// Component Imports
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyUrlButton";
import { Modal } from "@/components/ui/Modal";

// API Requests
import { api } from "@/lib/api";
// import { useRouter, useSearchParams } from "next/navigation";

// Store Imports
import { useLandingStore } from "@/store/landingStore";
import { useAuth } from "@/store/auth";
import Link from "next/link";

// Types and Interface
type PageProps = {
  params: {
    value: string;
  };
};

interface VacancyData {
  PositionDetail: {
    text: string;
  };
  super_vip_status: string;
  vip_status: string;
  work_schedule: {
    name: string;
  };
  work_experience: number;
  amount_type: number;
  fixed_amount: number;
  CurrencyDetail: {
    text: string;
  };
  min_bonus: number;
  max_bonus: number;
  min_amount: number;
  max_amount: number;
  avarage_min_bonus: number;
  avarage_max_bonus: number;
  CompanyDetail: {
    logo: string;
    facebook: string;
    website: string;
    brandname: string;
    address: string;
  };
  SphereDetail: {
    text: string;
  };
  VacancyLocation: {
    name: string;
  };
  what_to_do: string;
  result_to_work: string;
  how_is_it_measured: string;
  result_to_work_desc: string;
  VacancyCategoryList: string;
  additional_info: string;
  VacancyReasonList: string;
  VacancyCategory: number;
}

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

import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  example: string;
  exampleRequired: string;
};

const Jobs = ({ params }: PageProps) => {
  //:::* Store States :::*//
  // const loading = useLandingStore((state) => state.loading);
  const setLoading = useLandingStore((state) => state.setLoading);
  const user = useAuth((state) => state.user);

  //:::* Component States :::*//
  const [fullUrl, setFullUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("tab1");
  const [vacancyInnerData, setVacancyInnerData] = useState<VacancyData | null>(
    null
  );
  const [topVacancy, setTopVacancy] = useState<vacancyType[]>([]);

  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  // console.log(watch("example"));

  //:::* Functions :::*//
  // Helper function to get work experience text
  const getWorkExperienceText = (experienceValue: number) => {
    if (experienceValue === undefined) return "";

    switch (experienceValue) {
      case 1:
        return "გამოცდილების გარეშე";
      case 2:
        return "დამწყები";
      case 3:
        return "საშუალო დონე";
      case 4:
        return "პროფესიონალი";
      default:
        return "";
    }
  };

  // Helper function to get amount type text
  const getAmountTypeText = (amountType: number) => {
    if (amountType === undefined) return "";

    switch (amountType) {
      case 1:
        return "ფიქსირებული+ბონუსი";
      case 2:
        return "გამომუშავებით";
      case 3:
        return "მხოლოდ ფიქსირებული";
      default:
        return "";
    }
  };

  // Helper function to format number
  const formatNumber = (number: number) => {
    return Number(number).toLocaleString();
  };

  const handleSubmitCV = async () => {
    // დადასტურების alert
    const result = await Swal.fire({
      title: "CV-ის გაგზავნა",
      text: "დარწმუნებული ხართ, რომ გსურთ CV-ის გაგზავნა ამ ვაკანსიაზე?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "დიახ, გაგზავნა",
      cancelButtonText: "არა, გაუქმება",
      confirmButtonColor: "#155dfc",
      cancelButtonColor: "#6b7280",
    });

    // თუ გააუქმა
    if (!result.isConfirmed) {
      return;
    }

    // ვაჩვენოთ loading
    Swal.fire({
      title: "იგზავნება...",
      html: "გთხოვთ დაელოდოთ, თქვენი CV იგზავნება",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // იმიტირებული delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // წარმატება
    Swal.fire({
      icon: "success",
      title: "წარმატებული!",
      text: "თქვენი CV წარმატებით გაიგზავნა",
      confirmButtonText: "დახურვა",
      confirmButtonColor: "#10b981",
      timer: 3000,
      timerProgressBar: true,
    });
  };

  //:::* Hooks :::*//
  useEffect(() => {
    setFullUrl(window.location.href);
  }, []);

  useEffect(() => {
    setLoading(false);
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const parsedValue = JSON.parse(params.value);
        const id = parsedValue.id;

        // console.log(id);
        if (params?.value) {
          const response = await api.public.get(
            `/public/vacancy/get_by_id/${id}`
          );

          // console.log(response);
          setVacancyInnerData(response);

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params, setLoading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.public.get(`/public/top_vacancy`);

        // console.log(response);
        setTopVacancy(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params, setLoading]);

  return (
    <>
      <div className="bg-gray-50 overflow-x-hidden">
        <section className="px-4 md:px-10 bg-gradient-to-b from-white to-gray-50 mt-30 mb-30">
          <div className="grid grid-cols-12 gap-4 items-start">
            <div
              className={`col-span-12 md:col-span-8 p-10 rounded-2xl border  ${
                vacancyInnerData?.super_vip_status === "active"
                  ? "border-amber-500 bg-[#ffb70010]"
                  : vacancyInnerData?.vip_status === "active"
                  ? "border-blue-500 bg-[#246af609]"
                  : "border-gray-300"
              } `}
            >
              {/* TOP */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <Image
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                    src={
                      (vacancyInnerData &&
                        vacancyInnerData?.CompanyDetail?.logo) ||
                      "/images/noavata.jpeg"
                    }
                    width={64}
                    height={64}
                    alt="Company logo"
                  />

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {vacancyInnerData?.PositionDetail?.text || "Loading..."}
                    </h3>
                    <p className="text-gray-500 text-sm mb-1">
                      {vacancyInnerData?.SphereDetail?.text}
                    </p>

                    <p className="text-blue-700 text-sm items-center gap-2 mb-1">
                      {vacancyInnerData?.CompanyDetail?.brandname}
                    </p>

                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
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
                      {vacancyInnerData?.VacancyLocation?.name}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {/* Facebook Icon */}
                  {vacancyInnerData?.CompanyDetail?.facebook && (
                    <a
                      href={vacancyInnerData?.CompanyDetail?.facebook}
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
                  {vacancyInnerData &&
                    vacancyInnerData?.CompanyDetail?.website && (
                      <a
                        href={
                          vacancyInnerData &&
                          vacancyInnerData?.CompanyDetail?.website
                        }
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

              {/* Middle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* სამუშაო გრაფიკი */}
                <div className="space-y-1">
                  <span className="text-gray-600 text-sm">სამუშაო გრაფიკი</span>
                  <div className="text-gray-900 font-medium">
                    {vacancyInnerData?.work_schedule?.name}
                  </div>
                </div>

                {/* გამოცდილება */}
                <div className="space-y-1">
                  <span className="text-gray-600 text-sm">გამოცდილება</span>
                  <div className="text-gray-900 font-medium">
                    {vacancyInnerData &&
                      getWorkExperienceText(vacancyInnerData?.work_experience)}
                  </div>
                </div>

                {/* ანაზღაურება */}
                <div className="space-y-1">
                  <span className="text-gray-600 text-sm">ანაზღაურება</span>
                  <div className="text-gray-900 font-medium">
                    {vacancyInnerData &&
                      getAmountTypeText(vacancyInnerData?.amount_type)}
                  </div>
                </div>

                {/* ფიქსირებული ხელფასი */}
                {vacancyInnerData?.fixed_amount != null && (
                  <div className="space-y-1">
                    <span className="text-gray-600 text-sm">
                      ფიქსირებული ხელფასი
                    </span>
                    <div className="text-gray-900 font-medium">
                      {vacancyInnerData &&
                        formatNumber(vacancyInnerData.fixed_amount)}{" "}
                      {vacancyInnerData &&
                        vacancyInnerData?.CurrencyDetail?.text}
                    </div>
                  </div>
                )}

                {/* საშუალო ბონუსი (amount_type == 1) */}
                {vacancyInnerData?.amount_type == 1 && (
                  <div className="space-y-1">
                    <span className="text-gray-600 text-sm">
                      საშუალო ბონუსი
                    </span>
                    <div className="text-gray-900 font-medium">
                      მინ {formatNumber(vacancyInnerData.min_bonus)}{" "}
                      {vacancyInnerData?.CurrencyDetail?.text} - მაქს{" "}
                      {formatNumber(vacancyInnerData.max_bonus)}{" "}
                      {vacancyInnerData?.CurrencyDetail?.text}
                    </div>
                  </div>
                )}

                {/* საშუალო ბონუსი (amount_type == 2) */}
                {vacancyInnerData?.amount_type == 2 && (
                  <div className="space-y-1">
                    <span className="text-gray-600 text-sm">
                      საშუალო ბონუსი
                    </span>
                    <div className="text-gray-900 font-medium">
                      მინ{" "}
                      {vacancyInnerData &&
                        formatNumber(vacancyInnerData.min_amount)}{" "}
                      {vacancyInnerData?.CurrencyDetail?.text} - მაქს{" "}
                      {vacancyInnerData &&
                        formatNumber(vacancyInnerData.max_amount)}{" "}
                      {vacancyInnerData?.CurrencyDetail?.text}
                    </div>
                  </div>
                )}

                {/* საშუალო ჯამური შემოსავალი */}
                {vacancyInnerData?.amount_type == 1 && (
                  <div className="space-y-1">
                    <span className="text-gray-600 text-sm">
                      საშუალო ჯამური შემოსავალი
                    </span>
                    <div className="text-gray-900 font-medium">
                      მინ{" "}
                      {vacancyInnerData &&
                        formatNumber(vacancyInnerData.avarage_min_bonus)}{" "}
                      {vacancyInnerData?.CurrencyDetail?.text} - მაქს{" "}
                      {vacancyInnerData &&
                        formatNumber(vacancyInnerData.avarage_max_bonus)}{" "}
                      {vacancyInnerData?.CurrencyDetail?.text}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom */}
              <div className="w-full">
                {/* Tab Headers */}
                <div className="flex border p-1 rounded-2xl border-gray-200">
                  <button
                    onClick={() => setActiveTab("tab1")}
                    className={`flex-1 py-2 px-4 text-sm font-medium text-center border-b-2 transition-colors duration-200 rounded-2xl cursor-pointer ${
                      activeTab === "tab1"
                        ? "bg-blue-500 text-white"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    ვაკანსია
                  </button>
                  <button
                    onClick={() => setActiveTab("tab2")}
                    className={`flex-1 py-2 px-4 text-sm font-medium text-center border-b-2 transition-colors duration-200 rounded-2xl cursor-pointer ${
                      activeTab === "tab2"
                        ? "bg-blue-500 text-white"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    კომპანიის შესახებ
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                  {activeTab === "tab1" && (
                    <div>
                      <div className="space-y-6">
                        {/* რა უნდა გააკეთო */}
                        {vacancyInnerData?.what_to_do && (
                          <div className="detail hidden">
                            <h5 className="text-lg font-semibold text-gray-900 mb-3">
                              რა უნდა გააკეთო?
                            </h5>
                            <p className="text-gray-700 leading-relaxed">
                              {vacancyInnerData?.what_to_do}
                            </p>
                          </div>
                        )}

                        {/* იზომება თუ არა შენი მუშაობის შედეგები */}
                        <div className="detail hidden">
                          <h5 className="text-lg font-semibold text-gray-900 mb-3">
                            იზომება თუ არა შენი მუშაობის შედეგები?
                          </h5>
                          {vacancyInnerData?.result_to_work === "yes" &&
                            vacancyInnerData?.how_is_it_measured != null && (
                              <p className="text-gray-700 leading-relaxed">
                                იზომება
                              </p>
                            )}
                          {vacancyInnerData?.result_to_work === "no" && (
                            <p className="text-gray-700 leading-relaxed">
                              არა არ იზომება
                            </p>
                          )}
                        </div>

                        {/* როგორ იზომება */}
                        {vacancyInnerData?.result_to_work === "yes" &&
                          vacancyInnerData?.how_is_it_measured != null && (
                            <div className="detail hidden">
                              <h5 className="text-lg font-semibold text-gray-900 mb-3">
                                როგორ იზომება?
                              </h5>
                              <p className="text-gray-700 leading-relaxed">
                                {vacancyInnerData.how_is_it_measured}
                              </p>
                            </div>
                          )}

                        {/* რა შედეგებს უნდა მიაღწიო */}
                        {vacancyInnerData?.result_to_work_desc && (
                          <div className="detail">
                            <h5 className="text-lg font-semibold text-gray-900 mb-3">
                              რა შედეგებს უნდა მიაღწიო
                            </h5>
                            <p className="text-gray-700 leading-relaxed">
                              {vacancyInnerData.result_to_work_desc}
                            </p>
                          </div>
                        )}

                        {/* დეტალები */}
                        {vacancyInnerData?.VacancyCategoryList &&
                          vacancyInnerData.VacancyCategoryList !== "" && (
                            <div className="detail">
                              <h5 className="text-lg font-semibold text-gray-900 mb-3">
                                დეტალები
                              </h5>
                              <ul className="pl-4 space-y-1">
                                {Array.isArray(
                                  vacancyInnerData.VacancyCategoryList
                                ) ? (
                                  vacancyInnerData.VacancyCategoryList.map(
                                    (item, index) => (
                                      <li
                                        key={item.id || index}
                                        className="text-gray-700 list-disc"
                                      >
                                        {typeof item === "object"
                                          ? item.name || item.text || item
                                          : item}
                                      </li>
                                    )
                                  )
                                ) : (
                                  <li className="text-gray-700 list-disc">
                                    {vacancyInnerData.VacancyCategoryList}
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}

                        {/* დამატებითი ინფორმაცია */}
                        {vacancyInnerData?.additional_info && (
                          <div className="detail">
                            <h5 className="text-lg font-semibold text-gray-900 mb-3">
                              დამატებითი ინფორმაცია
                            </h5>
                            <HtmlRenderer
                              content={vacancyInnerData?.additional_info}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {activeTab === "tab2" && (
                    <div>
                      <div className="detail">
                        <h5 className="text-lg font-semibold text-gray-900 mb-4">
                          რატომ უნდა იმუშაო ჩვენს კომპანიაში?
                        </h5>

                        <ul className="pl-4 space-y-2 mb-6">
                          {vacancyInnerData &&
                          Array.isArray(vacancyInnerData.VacancyReasonList) ? (
                            vacancyInnerData.VacancyReasonList.map(
                              (item, index) => (
                                <li
                                  key={item.id || index}
                                  className="text-gray-700 list-disc leading-relaxed"
                                >
                                  {typeof item === "object"
                                    ? item.name || item.text || item
                                    : item}
                                </li>
                              )
                            )
                          ) : (
                            <li className="text-gray-700 list-disc leading-relaxed">
                              {vacancyInnerData &&
                                vacancyInnerData?.VacancyReasonList}
                            </li>
                          )}
                        </ul>

                        {/* Address Section */}
                        {vacancyInnerData?.CompanyDetail?.address && (
                          <div className="detail-address flex items-center space-x-2 text-gray-600">
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
                            <span className="text-sm">
                              {vacancyInnerData.CompanyDetail.address}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-stretch gap-2 mt-20">
                <Button
                  type="button"
                  variant="primary"
                  length="full"
                  size="lg"
                  disabled={!user}
                  onClick={handleSubmitCV}
                >
                  {vacancyInnerData?.VacancyCategory !== 279
                    ? "CV-ის გაგზავნა"
                    : "საკონტაქტოს დატოვება"}
                </Button>

                <CopyButton variant="primary" url={`${fullUrl}`} />
              </div>
            </div>
            <div className="col-span-12 md:col-span-4 ounded-2xl">
              <div className="grid grid-cols-1 gap-4">
                {/* Vip Job Card */}
                {topVacancy &&
                  topVacancy.map((item) => (
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
            </div>
          </div>
        </section>
      </div>

      {/* Send Cv Modal */}
      <Modal isOpen={false} onClose={() => false}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <input
            className="border"
            {...register("exampleRequired", { required: true })}
          />

          {/* include validation with required or other standard HTML validation rules */}
          <input
            className="border"
            {...register("exampleRequired", { required: true })}
          />

          {/* errors will return when field validation fails  */}
          {errors.exampleRequired && <span>This field is required</span>}

          <input type="submit" />
        </form>
      </Modal>
    </>
  );
};

export default Jobs;
