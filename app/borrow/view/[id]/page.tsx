"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { getBorrowById } from "@/services/borrow.service";
import { HiChevronLeft } from "react-icons/hi2";

export default function BorrowViewPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { user } = useAuthContext();
  const [borrow, setBorrow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace("/api/v1", "") || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return setLoading(false);
      try {
        const res = await getBorrowById(id);
        if (res?.success) setBorrow(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading borrow details...</div>;
  if (!borrow) return <div className="p-10 text-center">Borrow request not found.</div>;

  const book = borrow.book || {};
  const pdfName = book.pdf ? book.pdf.replace(/\\/g, "/").split("/").pop() : null;
  const coverName = book.cover ? book.cover.replace(/\\/g, "/").split("/").pop() : null;
  const pdfUrl = pdfName ? `${backendBaseUrl}/uploads/${pdfName}` : null;
  const coverUrl = coverName ? `${backendBaseUrl}/uploads/${coverName}` : null;
  const fileUrl = pdfUrl || coverUrl;
  const isPdf = Boolean(pdfUrl);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <button onClick={() => router.push(user?.role === 'student' ? '/dashboard/student' : '/dashboard')} className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0099cc] font-bold text-xs uppercase mb-4">
        <HiChevronLeft size={18} /> Back to Dashboard
      </button>
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Online Borrow Request</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{book.title || "Untitled Book"}</h1>
            <p className="text-sm text-slate-600">Requested by {borrow.user?.firstName} {borrow.user?.lastName} ({borrow.user?.email})</p>
          </div>
          <div className="rounded-3xl bg-sky-50 px-4 py-3 text-slate-700 text-sm font-semibold">Status: {borrow.status}</div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-[0.13em]">Book Details</h2>
              <p className="mt-3 text-sm text-slate-600"><span className="font-semibold text-slate-800">Author:</span> {book.author || "N/A"}</p>
              <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Category:</span> {book.category || "N/A"}</p>
              <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">ISBN:</span> {book.isbn || "N/A"}</p>
              <p className="text-sm text-slate-600"><span className="font-semibold text-slate-800">Available:</span> {book.available ?? book.quantity ?? "N/A"}</p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-[0.13em]">Assignment</h2>
              <p className="mt-3 text-sm text-slate-600">
                Assigned to: {borrow.assignedTo ? `${borrow.assignedTo.firstName} ${borrow.assignedTo.lastName} (${borrow.assignedTo.role})` : "Not assigned yet"}
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            {fileUrl ? (
              isPdf ? (
                <iframe src={fileUrl} className="w-full h-[380px]" title="Book PDF" />
              ) : (
                <img src={fileUrl} alt={book.title} className="w-full h-[380px] object-cover" />
              )
            ) : (
              <div className="flex h-[380px] items-center justify-center bg-slate-50 text-slate-400">No preview available</div>
            )}
            {fileUrl && (
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <a href={fileUrl} target="_blank" rel="noreferrer" className="text-sm text-sky-600 hover:text-sky-700 font-semibold">Open in a new tab</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
