"use client";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Hooks

// Component Imports
import Loading from "./loading";
import Header from "../components/layout/landing/Header";
import Footer from "@/components/layout/landing/Footer";

// Store Imports
import { useLandingStore } from "@/store/landingStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //:::* Store States :::*//
  const loading = useLandingStore((state) => state.loading);

  //:::* Component States :::*//

  //:::* Hooks :::*//

  return (
    <html lang="en">
      <body>
        {/* Loading Component */}
        {loading && <Loading />}

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

            // /* Custom scrollbar */
            // ::-webkit-scrollbar {
            //   width: 10px;
            // }

            // ::-webkit-scrollbar-track {
            //   background: #f1f1f1;
            // }

            // ::-webkit-scrollbar-thumb {
            //   background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
            //   border-radius: 5px;
            // }

            /* Blob shapes */
            .blob {
              position: absolute;
              filter: blur(100px);
              opacity: 0.6;
            }
          `}
        </style>

        {/* Animated Background Blobs */}
        <div className="fixed inset-0 -z-10">
          <div className="blob w-96 h-96 bg-blue-400 -top-48 -left-48 animate-float"></div>
          <div
            className="blob w-96 h-96 bg-blue-300 -bottom-48 -right-48 animate-float"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>

        {/* Modern Header */}
        {!loading && <Header />}

        {children}

        {/* Modern Footer */}
        {!loading && <Footer />}
      </body>
    </html>
  );
}
