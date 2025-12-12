"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/Inputs";
import { useRouter } from "next/navigation";
import Link from "next/link";

// API Requests
import { api } from "@/lib/api";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

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
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  //:::* Component Functions :::*//
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // if (!/^5\d{8}$/.test(formData.mobile)) {
    //   newErrors.mobile = "არასწორი მობილური (5XXXXXXXX)";
    // }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "არასწორი ელ.ფოსტა";
    }
    if (formData.password.length < 8) {
      newErrors.password = "მინიმუმ 8 სიმბოლო";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await api.public.post("/auth/login", formData);
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
        <div className="flex h-screen bg-gray-50 pt-32 lg:pt-0">
          <div className="hidden lg:block lg:w-1/2 relative h-full">
            <Image
              priority
              src="/images/signin_cover.jpg"
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
              <div className="mb-5">
                <h2 className="text-2xl font-bold">ავტორიზაცია</h2>
                <small className="text-gray-500">
                  გაიარე ავტორიზაცია და გააგზავნე CV მარტივად
                </small>
              </div>

              {/* <Input
                label="მობილური"
                type="tel"
                placeholder="5XX XX XX XX"
                value={formData.mobile}
                onChange={handleChange("mobile")}
                error={errors.mobile}
                required
              /> */}

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

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                შესვლა
              </button>

              <div className="mt-2 text-center">
                <Link className="text-blue-700 d-block text-sm" href="/USER">
                  რეგისტრაცია
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
