"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSingleBook, updateBook } from "@/services/book.service"; 
import Swal from "sweetalert2";
import { HiOutlinePencilSquare, HiOutlineArrowLeft } from "react-icons/hi2";

export default function EditBookPage() {
  const { id } = useParams(); 
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Historical fiction",
    quantity: 1,
  });
 useEffect(() => {
  const fetchBookData = async () => {
    try {
      const res = await getSingleBook(id as string);
      if (res.success) {
        
        setForm(res.data || res.book); 
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      Swal.fire("Error", "Could not load book data", "error");
    } finally {
      setLoading(false);
    }
  };
  if (id) fetchBookData();
}, [id]);
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateBook(id as string, form);
      if (res.success) {
        await Swal.fire("Success", "Book updated successfully!", "success");
        router.push("/books"); 
      }
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div className="p-10 text-center font-bold text-[#0099cc] animate-pulse">Loading Book Info...</div>;
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-slate-500 hover:text-[#0099cc] font-bold text-xs uppercase transition-colors"
      >
        <HiOutlineArrowLeft size={18} /> Back to List
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-[#0099cc] p-6 text-white flex items-center gap-3">
          <HiOutlinePencilSquare size={24} />
          <h1 className="text-xl font-bold uppercase tracking-widest">Edit Book Details</h1>
        </div>

        <form onSubmit={handleUpdate} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Book Title</label>
            <input 
              required className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0099cc]/20 focus:border-[#0099cc] font-bold text-slate-700"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Author</label>
            <input 
              required className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#0099cc]"
              value={form.author}
              onChange={(e) => setForm({...form, author: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ISBN</label>
            <input 
              required className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
              value={form.isbn}
              onChange={(e) => setForm({...form, isbn: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
            <select 
              className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer font-bold text-slate-600"
              value={form.category}
              onChange={(e) => setForm({...form, category: e.target.value})}
            >
              <option value="Adventure stories">Adventure stories</option>
              <option value="Classics">Classics</option>
              <option value="Historical fiction">Historical fiction</option>
              <option value="Science fiction">Science fiction</option>
              <option value="Biography">Biography</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</label>
            <input 
              type="number" min="0" required 
              className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-[#0099cc]"
              value={form.quantity}
              onChange={(e) => setForm({...form, quantity: parseInt(e.target.value)})}
            />
          </div>

          <button 
            type="submit" 
            className="md:col-span-2 bg-[#0099cc] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
