"use client";
import { useState, useEffect } from "react";
import { getAllBooks } from "@/services/book.service";
import { HiOutlineBookOpen, HiMagnifyingGlass, HiCheckCircle, HiXCircle } from "react-icons/hi2";

export default function CatalogPage() {
  const [books, setBooks] = useState<any[]>([]);
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

  useEffect(() => { fetchBooks(); }, []);
  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
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
                  {isAvailable ? (
                    <div className="flex items-center gap-1 text-green-600 font-bold text-[10px] uppercase bg-green-50 px-2 py-1 rounded">
                      <HiCheckCircle size={14} /> Available ({book.quantity})
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-500 font-bold text-[10px] uppercase bg-red-50 px-2 py-1 rounded">
                      <HiXCircle size={14} /> Out of Stock
                    </div>
                  )}
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
