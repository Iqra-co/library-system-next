"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../context/AuthContext";
import Sidebar from "../components/sidebar";
import Navbar from "../components/nav";
import Footer from "../components/footer";

import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const noLayoutPages = ["/login", "/register", "/"]; 
const isAuthPage = noLayoutPages.includes(pathname);
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {isAuthPage ? (
            <div className="min-h-screen w-full overflow-x-hidden">
              {children}
            </div>
          ) : (
<div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
  <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
  
  <div className="flex-1 flex flex-col min-w-0 w-full">
    <Navbar onMenuClick={() => setSidebarOpen(true)} />
    <main className="flex-1 p-4 sm:p-8 w-full">
      {children}
    </main>
    <Footer />
  </div>
</div>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
