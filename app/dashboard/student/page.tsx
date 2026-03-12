"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { getMyBorrowedBooks } from "@/services/borrow.service";
import { HiOutlineBookOpen, HiOutlineClipboardDocumentList, HiOutlineArrowRightCircle } from "react-icons/hi2";
import Link from "next/link";

export default function StudentWelcomePage() {
  const { user } = useAuthContext();
  const [borrowCount, setBorrowCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
const fetchStats = async () => {
  try {
    const res = await getMyBorrowedBooks();
    const borrowData = res.data || res.borrows || [];
    if (Array.isArray(borrowData)) {
      const activeBorrows = borrowData.filter((b: any) => !b.returned).length;
      setBorrowCount(activeBorrows);
    }
  } catch (err: any) { 
    console.error("Student Stats Error:", err.response?.status); 
  } finally { 
    setLoading(false); 
  }
};
    if (user) fetchStats();
  }, [user]);

  return (
    <div className="p-6 sm:p-10 space-y-10 animate-in fade-in duration-700">
      <div className="bg-gradient-to-r from-[#0099cc] to-blue-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold uppercase tracking-tight">Welcome Back, {user?.firstName}! </h1>
          <p className="mt-2 text-blue-100 font-medium">Ready to explore new stories today? Your digital library is just a click away.</p>
        </div>
        <HiOutlineBookOpen size={150} className="absolute -right-10 -bottom-10 text-white/10 rotate-12" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#0099cc] transition-all">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Currently Borrowed</p>
            <h2 className="text-4xl font-bold text-slate-800 mt-1">{loading ? "..." : borrowCount}</h2>
          </div>
          <div className="p-4 bg-blue-50 text-[#0099cc] rounded-2xl group-hover:bg-[#0099cc] group-hover:text-white transition-colors">
            <HiOutlineClipboardDocumentList size={32} />
          </div>
        </div>

        <Link href="/dashboard/student/catalog" className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#0099cc] transition-all">
          <div>
            <p className="text-xs font-bold text-[#0099cc] uppercase tracking-widest">New Arrival</p>
            <h2 className="text-xl font-bold text-slate-800 mt-1">Browse Catalog</h2>
          </div>
          <div className="text-slate-200 group-hover:text-[#0099cc] transition-colors">
            <HiOutlineArrowRightCircle size={40} />
          </div>
        </Link>
      </div>
      <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Library Tip</h3>
        <p className="text-sm text-slate-600 italic">"Remember to return your books within 14 days to avoid overdue marks on your profile."</p>
      </div>
    </div>
  );
}
