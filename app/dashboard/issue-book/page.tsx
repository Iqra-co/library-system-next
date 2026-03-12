"use client";
import { useState, useEffect } from "react";
import { getAllBooksAdmin, getAllUsersAdmin } from "@/services/admin.service";
import { issueBook } from "@/services/borrow.service";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function IssueBookPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const [bookRes, userRes] = await Promise.all([getAllBooksAdmin(), getAllUsersAdmin()]);
      setBooks(bookRes.books || []);
      setUsers(userRes.users?.filter((u: any) => u.role === 'student') || []);
    };
    fetchData();
  }, []);
  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook || !selectedUser) return Swal.fire("Error", "Please select both Student & Book", "error");
    setLoading(true);
    try {
      const res = await issueBook(selectedBook, selectedUser); 
      if (res.success) {
        Swal.fire("Issued!", "Book successfully assigned to student.", "success");
        router.push("/dashboard");
      }
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.message || "Issue failed", "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
      <h1 className="text-2xl font-bold text-[#0099cc] uppercase mb-8 border-l-4 border-[#0099cc] pl-3">Issue New Book</h1>
      
      <form onSubmit={handleIssue} className="space-y-6">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Student</label>
          <select 
            className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-700"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Choose a Student...</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.firstName} {u.lastName} ({u.IdNo})</option>)}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Book</label>
          <select 
            className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold text-slate-700"
            onChange={(e) => setSelectedBook(e.target.value)}
          >
            <option value="">Choose a Book...</option>
            {books.filter(b => b.available > 0).map(b => <option key={b._id} value={b._id}>{b.title} - (In Stock: {b.available})</option>)}
          </select>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-[#0099cc] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg"
        >
          {loading ? "ISSUING..." : "CONFIRM ISSUANCE"}
        </button>
      </form>
    </div>
  );
}
