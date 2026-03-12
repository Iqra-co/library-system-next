"use client";
import { useState, useEffect } from "react";
import { getMyBorrowedBooks } from "@/services/borrow.service";
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamationTriangle } from "react-icons/hi2";

export default function MyBorrowsPage() {
  const [borrows, setBorrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyBorrowedBooks();
        if (res.success) setBorrows(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-slate-800 uppercase border-l-4 border-[#0099cc] pl-3">My Borrows</h1>
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b">
            <tr>
              <th className="p-4">Book Title</th>
              <th className="p-4">Issue Date</th>
              <th className="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {borrows.length > 0 ? borrows.map((b) => (
              <tr key={b._id} className="border-b last:border-0 hover:bg-slate-50">
               <td className="p-4 text-center">
  <div className="flex flex-col items-center gap-1.5">
    {b.returned ? (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 uppercase">
        <HiOutlineCheckCircle size={14} /> Returned
      </span>
    ) : (
      <>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200 uppercase">
          <HiOutlineClock size={14} className="animate-spin-slow" /> Pending
        </span>
      
        {(new Date().getTime() - new Date(b.issueDate).getTime()) / (1000 * 3600 * 24) > 14 && (
          <span className="flex items-center gap-1 text-[8px] text-red-600 font-black animate-pulse uppercase tracking-tighter">
            <HiOutlineExclamationTriangle size={12} /> Overdue - Return Now
          </span>
        )}
      </>
    )}
  </div>
</td>
              </tr>
            )) : (
              <tr><td colSpan={3} className="p-10 text-center text-slate-400 uppercase font-bold">No books borrowed yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
