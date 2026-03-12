"use client";
import { useState } from "react";
import { addBook } from "@/services/book.service";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { HiOutlineBookOpen, HiOutlineCloudArrowUp } from "react-icons/hi2";

export default function AddBookPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "Historical fiction",
    quantity: 1,
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("isbn", form.isbn);
      formData.append("category", form.category);
      formData.append("quantity", form.quantity.toString());
      if (coverImage) {
        formData.append("coverImage", coverImage); 
      }
      const res = await addBook(formData); 
      
      if (res.success) {
        await Swal.fire("Success", "Book registered in library inventory!", "success");
        router.push("/books");
      }
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Internal Server Error", "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden border border-slate-100">
        <div className="bg-blue-500 p-6 text-white flex items-center gap-3">
          <HiOutlineBookOpen size={28} />
          <h1 className="text-xl font-bold uppercase tracking-widest text-white">Add New Book Entity</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cover Image</label>
             <div className="relative h-64 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center group hover:border-blue-400 transition-all overflow-hidden">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <HiOutlineCloudArrowUp size={48} className="mx-auto text-slate-300" />
                    <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Image File</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
             </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Book Title</label>
              <input required className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-700 focus:border-blue-700"
                placeholder="Enter title" onChange={(e) => setForm({...form, title: e.target.value})} />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Author</label>
              <input required className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                placeholder="Author name" onChange={(e) => setForm({...form, author: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ISBN</label>
                <input required className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                  placeholder="e.g. 978-01..." onChange={(e) => setForm({...form, isbn: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quantity</label>
                <input type="number" min="1" required className="w-full mt-1 p-3 bg-blue-50 border border-blue-100 rounded-lg outline-none font-bold text-blue-700"
                  value={form.quantity} onChange={(e) => setForm({...form, quantity: parseInt(e.target.value)})} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
              <select className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold"
                value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
                <option value="Historical fiction">Historical fiction</option>
                <option value="Classics">Classics</option>
                <option value="Science fiction">Science fiction</option>
                <option value="Biography">Biography</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="md:col-span-2 bg-blue-500 text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-blue-800 transition-all active:scale-95 disabled:bg-slate-300">
            {loading ? "Registering Book..." : "Add to Library Inventory"}
          </button>
        </form>
      </div>
    </div>
  );
}
