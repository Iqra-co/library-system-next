"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBorrowById } from "@/services/borrow.service";

export default function AdminBorrowView() {
  const search = useSearchParams();
  const id = search?.get("id") || "";
  const [borrow, setBorrow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace("/api/v1", "") || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return setLoading(false);
      try {
        const res = await getBorrowById(id);
        if (res?.success) setBorrow(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!borrow) return <div className="p-10 text-center">Borrow not found.</div>;

  const book = borrow.book || {};
  const imageName = book.cover ? book.cover.replace(/\\/g, "/").split("/").pop() : null;
  const fileUrl = imageName ? `${backendBaseUrl}/uploads/${imageName}` : null;

  const isPdf = fileUrl ? fileUrl.toLowerCase().endsWith('.pdf') : false;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Borrow View</h1>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-bold">{book.title}</h2>
        <p className="text-sm text-slate-600">Author: {book.author}</p>
        <p className="text-sm text-slate-600">Borrower: {borrow.user?.firstName} {borrow.user?.lastName} ({borrow.user?.email})</p>
        <p className="text-sm text-slate-600">Status: {borrow.status}</p>

        {fileUrl && (
          <div className="mt-6">
            {isPdf ? (
              <iframe src={fileUrl} className="w-full h-[600px] border" title="Book PDF" />
            ) : (
              <img src={fileUrl} alt={book.title} className="max-w-full h-auto border rounded" />
            )}
            <div className="mt-2">
              <a href={fileUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">Open in new tab</a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
