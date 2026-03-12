"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllBooks, deleteBook } from "@/services/book.service"; 
import Swal from "sweetalert2";
import { 
  HiChevronDown, HiChevronUp, HiMagnifyingGlass, 
  HiArrowPath, HiPlus, HiOutlineAdjustmentsHorizontal,
  HiOutlinePencilSquare, HiOutlineTrash
} from "react-icons/hi2";

export default function BookListPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("None");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getAllBooks();
      if (res.success) {
        setBooks(res.data); 
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBooks();
  }, []);
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Confirm Delete?",
      text: "Book list deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0099cc",
      confirmButtonText: "Yes, delete!"
    });
    if (result.isConfirmed) {
      try {
        await deleteBook(id);
        setBooks(books.filter((b) => b._id !== id));
        Swal.fire("Deleted!", "Book successfully removed.", "success");
      } catch (err) {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };
  const filteredAndSortedBooks = books
    .filter((b) => b.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (orderBy === "Ascending") return a.title.localeCompare(b.title);
      if (orderBy === "Descending") return b.title.localeCompare(a.title);
      return 0;
    });
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center text-[#0099cc] uppercase tracking-widest">
        Book List
      </h1>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100"
        >
          <div className="flex items-center gap-2 font-bold text-slate-700">
            <HiOutlineAdjustmentsHorizontal size={20} className="text-[#0099cc]" />
            Filter
          </div>
          {isFilterOpen ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}
        </button>

        {isFilterOpen && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white transition-all animate-in slide-in-from-top duration-300">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Search</label>
              <div className="relative">
                <input 
                  type="text" placeholder="Search by title..."
                  className="w-full p-2.5 pl-10 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-[#0099cc]"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
                <HiMagnifyingGlass className="absolute left-3 top-3 text-slate-400" size={18} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Order By</label>
              <select 
                className="w-full p-2.5 border border-slate-300 rounded outline-none focus:ring-1 focus:ring-[#0099cc] bg-white cursor-pointer"
                value={orderBy} onChange={(e) => setOrderBy(e.target.value)}
              >
                <option value="None">None</option>
                <option value="Ascending">Ascending</option>
                <option value="Descending">Descending</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-50">
              <button 
                onClick={() => {setSearchTerm(""); setOrderBy("None");}}
                className="flex items-center gap-2 px-6 py-2 bg-slate-600 text-white rounded text-sm font-bold hover:bg-slate-700 transition"
              >
                <HiArrowPath size={16} /> RESET
              </button>
              <button className="flex items-center gap-2 px-8 py-2 bg-[#0099cc] text-white rounded text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                APPLY
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button 
          onClick={() => router.push("/books/add")}
          className="flex items-center gap-2 bg-[#0099cc] text-white px-5 py-2 rounded text-sm font-bold shadow-md hover:scale-105 transition-transform"
        >
          <HiPlus size={18} /> ADD
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0099cc] text-white text-xs font-bold uppercase tracking-widest">
              <tr>
                <th className="p-4 border-r border-white/20 w-16 text-center">Sl#</th>
                <th className="p-4 border-r border-white/20">Book Name</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={3} className="p-10 text-center font-bold text-[#0099cc] animate-pulse uppercase tracking-widest">Fetching Data...</td></tr>
              ) : filteredAndSortedBooks.length > 0 ? (
                filteredAndSortedBooks.map((book, index) => (
                  <tr key={book._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-center text-slate-400 font-medium">{index + 1}</td>
                    <td className="p-4 text-slate-700 font-bold uppercase">{book.title}</td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-4">
                        <button 
                          onClick={() => router.push(`/dashboard/edit-book/${book._id}`)}
                          className="text-blue-500 hover:text-blue-700 flex items-center gap-1 font-bold"
                        >
                          <HiOutlinePencilSquare size={16} /> Edit
                        </button>
                        <span className="text-slate-200">|</span>
                        <button 
                          onClick={() => book._id && handleDelete(book._id)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 font-bold"
                        >
                          <HiOutlineTrash size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3} className="p-10 text-center text-slate-400 italic">No books found in the inventory.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
