"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/Inputs";
import { Checkbox } from "@/components/ui/Checkbox";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

// API Requests
import { api } from "@/lib/api";
// import { useRouter } from "next/navigation";
import Link from "next/link";

// Store Imports
import { useLandingStore } from "@/store/landingStore";
import { useAuth } from "@/store/auth";

const Faq = () => {
  const router = useRouter();

  //:::* Store States :::*//
  const loading = useLandingStore((state) => state.loading);
  const setLoading = useLandingStore((state) => state.setLoading);

  //:::* Component States :::*//
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    repassword: "",
    type: "user",
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  //:::* Component Functions :::*//
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "სახელი და გვარი აუცილებელია";
    }
    if (!/^5\d{8}$/.test(formData.mobile)) {
      newErrors.mobile = "არასწორი მობილური (5XXXXXXXX)";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "არასწორი ელ.ფოსტა";
    }
    if (formData.password.length < 8) {
      newErrors.password = "მინიმუმ 8 სიმბოლო";
    }
    if (formData.repassword.length < 8) {
      newErrors.repassword = "მინიმუმ 8 სიმბოლო";
    }
    if (formData.password !== formData.repassword) {
      newErrors.repassword = "პაროლები არ ემთხვევა";
    }

    if (!formData.terms) {
      newErrors.terms = "გთხოვ დაეთანხმოთ წესებს";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await Swal.fire({
      title: "რეგისტრაცია",
      text: "დარწმუნებული ხართ, რომ გსურთ დარეგისტრირება?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "დიახ",
      cancelButtonText: "გაუქმება",
      confirmButtonColor: "#155dfc",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await api.public.post("/auth/signup", formData);
      console.log("Full response:", response); // იმისთვის რომ დაინახო structure

      // სწორად destructuring
      const { user, access_token } = response;

      // Zustand store-ში შენახვა + persist
      useAuth.getState().setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        token: access_token,
      });

      if (useAuth.getState().user) {
        router.push(`/`);
      }

      // console.log("User saved to store:", useAuth.getState().user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching data:", error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        // აქ cast-ი axios-ის error-ისთვის
        const axiosError = error as { response?: { data?: unknown } };
        console.error("API Error:", axiosError.response?.data);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
    };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData({ ...formData, [field]: checked });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

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
        <div className="flex h-screen bg-gray-50 lg:pt-0 mt-20">
          <div className="hidden lg:block lg:w-1/2 relative h-full">
            <Image
              priority
              src="/images/signup_cover.jpg"
              alt="Login Cover Image"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-10 ">
            <form
              onSubmit={handleSubmit}
              className="max-w-md mx-auto bg-white shadow-lg p-10 rounded-3xl"
            >
              <div className="mb-4">
                <Link
                  href="/USER"
                  className="text-blue-600 hover:text-blue-800 text-sm inline-block"
                >
                  ← უკან
                </Link>
              </div>
              <div className="mb-5">
                <h2 className="text-2xl font-bold">რეგისტრაცია</h2>
                <small className="text-gray-500">
                  დარეგისტრირდი და გააგზავნე CV მარტივად
                </small>
              </div>

              <Input
                label="სახელი და გვარი"
                placeholder="სახელი და გვარი"
                value={formData.name}
                onChange={handleChange("name")}
                error={errors.name}
                required
              />
              <Input
                label="მობილური"
                type="tel"
                placeholder="5XX XX XX XX"
                value={formData.mobile}
                onChange={handleChange("mobile")}
                error={errors.mobile}
                required
              />

              <Input
                label="ელ.ფოსტა"
                type="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange("email")}
                error={errors.email}
                required
              />

              <Input
                label="პაროლი"
                type="password"
                placeholder="მინიმუმ 8 სიმბოლო"
                value={formData.password}
                onChange={handleChange("password")}
                error={errors.password}
                required
              />

              <Input
                label="გაიმეორეთ პაროლი"
                type="password"
                placeholder="გაიმეორეთ პაროლი"
                value={formData.repassword}
                onChange={handleChange("repassword")}
                error={errors.repassword}
                required
              />

              <Checkbox
                label="ვეთანხმები წესებს და პირობებს"
                checked={formData.terms}
                onChange={(checked) => handleCheckboxChange("terms", checked)}
                error={errors.terms}
              />

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                რეგისტრაცია
              </button>

              <div className="mt-2 text-center">
                <Link
                  className="text-blue-700 d-block text-sm"
                  href="/USER/SIGNIN"
                >
                  ავტორიზაცია
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Faq;
