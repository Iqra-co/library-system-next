"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../context/AuthContext";
import Sidebar from "../components/Sidebar"; // Case-sensitivity ka dhyan rakhein
import Navbar from "../components/nav";
import Footer from "../components/footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Desktop par default me sidebar open (expanded) rahega
  const [isSidebarOpen, setSidebarOpen] = useState(true);
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
            // Flex box container height screen par lock kiya gaya hai
            <div className="flex h-screen bg-gray-50 overflow-hidden w-full">
              <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
              
              <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Click karne par true/false (toggle) hoga */}
                <Navbar onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-4 sm:p-8 overflow-y-auto w-full">
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
