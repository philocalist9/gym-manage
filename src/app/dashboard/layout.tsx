import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Sidebar from "@/app/components/sidebar";

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

export const metadata: Metadata = {
  title: "GymSync - Dashboard",
  description: "Gym management system dashboard",
  viewport: "width=device-width, initial-scale=1",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <div className="flex h-screen bg-[#0B101B] text-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64">
          <main className="h-screen overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
