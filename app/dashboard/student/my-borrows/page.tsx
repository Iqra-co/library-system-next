"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyBorrowedBooks } from "@/services/borrow.service";
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamationTriangle, HiChevronLeft } from "react-icons/hi2";

export default function MyBorrowsPage() {
  const router = useRouter();
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => router.push('/dashboard/student')} className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0099cc] font-bold text-xs uppercase">
        <HiChevronLeft size={18} /> Back to Dashboard
      </button>
      <h1 className="text-xl font-bold text-slate-900 uppercase border-l-4 border-sky-300 pl-3">My Borrows</h1>
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b">
            <tr>
              <th className="p-4">Book Title</th>
              <th className="p-4">Issue Date</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {borrows.length > 0 ? borrows.map((b) => {
              const status = b.returned ? "Returned" : b.status || "Pending";
              const isPending = !b.returned && status === "pending";
              const isApprovedOnline = !b.returned && status === "approved" && b.borrowType === "online";
              const isOverdue = !b.returned && b.issueDate && (new Date().getTime() - new Date(b.issueDate).getTime()) / (1000 * 3600 * 24) > 14;

              return (
                <tr key={b._id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{b.book?.title || "Untitled Book"}</div>
                    <div className="text-[10px] text-slate-500">{b.book?.author || "Unknown author"}</div>
                  </td>
                  <td className="p-4">{formatDate(b.issueDate)}</td>
                  <td className="p-4 uppercase font-bold text-[10px] tracking-[0.2em] text-slate-500">{b.borrowType || "physical"}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {b.returned ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase">
                          <HiOutlineCheckCircle size={14} /> Returned
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase">
                          <HiOutlineClock size={14} className="animate-spin-slow" /> Pending
                        </span>
                      ) : status === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-200 uppercase">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                          {status}
                        </span>
                      )}
                      {isOverdue && (
                        <span className="text-[8px] text-red-700 font-black uppercase tracking-tighter">Overdue - Return now</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {isApprovedOnline ? (
                      <Link href={`/borrow/view/${b._id}`} className="inline-flex items-center justify-center rounded-full bg-blue-600 px-3 py-2 text-white text-[10px] uppercase font-bold hover:bg-blue-700 transition-all">
                        Read Online
                      </Link>
                    ) : isPending ? (
                      <span className="text-[10px] text-slate-500 uppercase">Waiting for approval</span>
                    ) : b.returned ? (
                      <span className="text-[10px] text-emerald-700 uppercase">Completed</span>
                    ) : (
                      <span className="text-[10px] text-slate-500 uppercase">No action</span>
                    )}
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={5} className="p-10 text-center text-slate-400 uppercase font-bold">No books borrowed yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
