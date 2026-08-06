"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllBooks } from "@/services/book.service";
import { HiOutlineBookOpen, HiMagnifyingGlass, HiCheckCircle, HiXCircle, HiChevronLeft } from "react-icons/hi2";
import Swal from 'sweetalert2';
import { requestOnline, getMyBorrowedBooks } from '@/services/borrow.service';

export default function CatalogPage() {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [borrowMap, setBorrowMap] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace("/api/v1", "") || "http://localhost:5000";

  const fetchBooks = async () => {
    try {
      const res = (await getAllBooks()) as any;
      if (res.success) setBooks(res.data || res.books);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const fetchMyBorrows = async () => {
    try {
      const res = await getMyBorrowedBooks();
      if (res.success) {
        const borrows = res.data || [];
        const map: Record<string, any> = {};
        borrows.forEach((b: any) => {
          if (b.book && b.book._id) {
            // prefer the latest borrow record for this book
            map[b.book._id] = (map[b.book._id] && new Date(map[b.book._id].issueDate) > new Date(b.issueDate)) ? map[b.book._id] : b;
          }
        });
        setBorrowMap(map);
      }
    } catch (err) { console.error(err); }
  };

  const handleRequestOnline = async (bookId: string) => {
    try {
      const res = await requestOnline(bookId);
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Request Sent', text: res.message || 'Online request sent to admin.' });
        fetchBooks();
        fetchMyBorrows();
      } else {
        Swal.fire({ icon: 'error', title: 'Request Failed', text: res.message || 'Could not send request.' });
      }
    } catch (err: any) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: err.response?.data?.message || 'Request failed' });
    }
  };

  useEffect(() => { 
    (async () => {
      await Promise.all([fetchBooks(), fetchMyBorrows()]);
    })();
  }, []);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <button onClick={() => router.push('/dashboard/student')} className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0099cc] font-bold text-xs uppercase">
        <HiChevronLeft size={18} /> Back to Dashboard
      </button>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 uppercase border-l-4 border-[#0099cc] pl-3">
            Book Catalog
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 ml-4 tracking-widest">View available books in library</p>
        </div>
        <div className="relative w-full md:w-72">
          <input 
            type="text" placeholder="Search by title or author..." 
            className="w-full p-2.5 pl-10 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#0099cc]/20 focus:border-[#0099cc]" 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          <HiMagnifyingGlass className="absolute left-3 top-3 text-slate-400" size={18} />
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center font-bold text-[#0099cc] animate-pulse uppercase tracking-widest">Loading Books...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const isAvailable = book.quantity > 0;

            const imageName = book.cover ? book.cover.replace(/\\/g, "/").split("/").pop() : null;
            const fullImageUrl = `${backendBaseUrl}/uploads/${imageName}`;

            const borrowForBook = borrowMap[book._id];
            const isApprovedOnline = borrowForBook && borrowForBook.status === 'approved' && borrowForBook.borrowType === 'online';
            const isPending = borrowForBook && borrowForBook.status === 'pending' && borrowForBook.borrowType === 'online';

            return (
              <div key={book._id} className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:border-[#0099cc] hover:shadow-md transition-all flex flex-col h-full">
                
                <div className="h-40 bg-slate-50 rounded-lg flex items-center justify-center mb-4 border border-slate-50 overflow-hidden relative">
                  {book.cover ? (
                    <img 
                      src={fullImageUrl} 
                      alt={book.title} 
                      crossOrigin="anonymous" 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com";
                      }}
                    />
                  ) : (
                    <HiOutlineBookOpen size={48} className="text-slate-200" />
                  )}
                </div>

                <div className="flex-grow space-y-1">
                  <span className="text-[9px] font-black text-[#0099cc] uppercase tracking-tighter">{book.category}</span>
                  <h3 className="font-bold text-sm text-slate-800 uppercase line-clamp-2 leading-tight h-10">{book.title}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase italic">By {book.author}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Status</span>
                  <div className="flex items-center">
                    {isAvailable ? (
                      <div className="flex items-center gap-1 text-green-600 font-bold text-[10px] uppercase bg-green-50 px-2 py-1 rounded">
                        <HiCheckCircle size={14} /> Available ({book.quantity})
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-500 font-bold text-[10px] uppercase bg-red-50 px-2 py-1 rounded">
                        <HiXCircle size={14} /> Out of Stock
                      </div>
                    )}

                    {isApprovedOnline ? (
                      <Link href={`/borrow/view/${borrowForBook._id}`} className="ml-3 bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700">Read Online</Link>
                    ) : isPending ? (
                      <button disabled className="ml-3 bg-slate-200 text-slate-500 px-3 py-1 rounded text-xs font-bold">Requested (Pending)</button>
                    ) : isAvailable ? (
                      <button onClick={() => handleRequestOnline(book._id)} className="ml-3 bg-sky-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-sky-700">Request Online</button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!loading && filteredBooks.length === 0 && (
        <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest italic">No books found in catalog.</div>
      )}
    </div>
  );
}
