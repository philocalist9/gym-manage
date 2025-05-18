"use client";

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Sidebar from "@/app/components/sidebar";
import Navbar from "@/app/components/navbar";
import ClientSecurityWrapper from "@/app/components/client-security-wrapper";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-[#0B101B] text-gray-100 flex flex-col">
      {/* Navbar component - fixed at top */}
      <Navbar toggleSidebar={toggleSidebar} isOpen={sidebarOpen} />
      
      {/* Layout container with sidebar and content */}
      <div className="flex flex-1 mt-16">
        {/* Sidebar component - fixed position */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          ></div>
        )}

        {/* Main content area - responsive padding and margin */}
        <div className="flex-1 md:ml-64 transition-all duration-300 w-full">
          <main className="px-3 md:px-6 py-2 md:py-4 min-h-[calc(100vh-4rem)]">
            {/* Security components rendered in client */}
            <ClientSecurityWrapper />
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}


