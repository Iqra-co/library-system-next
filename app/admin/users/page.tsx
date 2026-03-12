"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllUsersAdmin, deleteUserAdmin } from "@/services/admin.service";
import { useAuthContext } from "@/context/AuthContext";
import Swal from "sweetalert2";
import { 
  HiChevronDown, HiChevronUp, HiMagnifyingGlass, 
  HiArrowPath, HiOutlineAdjustmentsHorizontal,
  HiOutlineTrash, HiOutlineUserCircle, HiOutlineShieldCheck
} from "react-icons/hi2";

export default function ManageUsersPage() {
  const router = useRouter();
  const { user: currentUser } = useAuthContext();
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("None");
  
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsersAdmin();
      if (res.success) setUsers(res.users || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (id === currentUser?._id) {
       return Swal.fire({
         title: "Access Denied!",
         text: "You cannot delete your own admin account.",
         icon: "error",
         confirmButtonColor: "#4f46e5"
       });
    }

    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "This member will be permanently removed from the system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", 
      cancelButtonColor: "#64748b", 
      confirmButtonText: "Yes, Delete Member"
    });

    if (result.isConfirmed) {
      try {
        await deleteUserAdmin(id);
        setUsers(users.filter((u) => u._id !== id));
        Swal.fire("Deleted!", "Member successfully removed.", "success");
      } catch (err: any) {
        Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
      }
    }
  };

  const filteredAndSortedUsers = users
    .filter((u) => 
      `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      if (orderBy === "Ascending") return nameA.localeCompare(nameB);
      if (orderBy === "Descending") return nameB.localeCompare(nameA);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
      <div className="border-l-4 border-indigo-600 pl-4">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
          Member Directory
        </h1>
        <p className="text-slate-500 text-sm font-medium">Manage library access and user permissions.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-between p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3 font-black text-slate-700 uppercase text-[11px] tracking-widest">
            <HiOutlineAdjustmentsHorizontal size={20} className="text-indigo-600" />
            Search & Filter Tools
          </div>
          {isFilterOpen ? <HiChevronUp size={20} className="text-slate-400" /> : <HiChevronDown size={20} className="text-slate-400" />}
        </button>

        {isFilterOpen && (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Full Search</label>
              <div className="relative group">
                <input 
                  type="text" placeholder="Search by name, email or ID..."
                  className="w-full p-3 pl-11 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-bold transition-all"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                />
                <HiMagnifyingGlass className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Alphabetical Order</label>
              <select 
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white cursor-pointer text-xs font-bold text-slate-700 transition-all appearance-none"
                value={orderBy} onChange={(e) => setOrderBy(e.target.value)}
              >
                <option value="None">None (Default)</option>
                <option value="Ascending">Name: A to Z</option>
                <option value="Descending">Name: Z to A</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-slate-50">
              <button 
                onClick={() => {setSearchTerm(""); setOrderBy("None");}}
                className="flex items-center gap-2 px-6 py-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl text-[10px] font-black transition uppercase tracking-widest"
              >
                <HiArrowPath size={16} /> Reset
              </button>
              <button className="flex items-center gap-2 px-8 py-2.5 bg-blue-500 text-white rounded-xl text-[10px] font-black hover:bg-blue-600 transition shadow-lg shadow-indigo-100 uppercase tracking-widest">
                Update View
              </button>
            </div>
          </div>
        )}
      </div>

    
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 text-slate-500 text-[10px] font-black uppercase tracking-[0.15em]">
              <tr>
                <th className="p-5 text-center w-20">#</th>
                <th className="p-5">Member Identity</th>
                <th className="p-5">Permission Level</th>
                <th className="p-5">Reference ID</th>
                <th className="p-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center font-black text-indigo-600 animate-pulse uppercase text-xs tracking-[0.2em]">Synchronizing Records...</td></tr>
              ) : filteredAndSortedUsers.length > 0 ? (
                filteredAndSortedUsers.map((u, index) => (
                  <tr key={u._id} className="group hover:bg-indigo-50/30 transition-all duration-200">
                    <td className="p-5 text-center text-slate-300 font-black text-xs">{index + 1}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <HiOutlineUserCircle size={24} />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 uppercase text-xs tracking-tight group-hover:text-blue-500">{u.firstName} {u.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-bold lowercase">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                        u.role === 'admin' 
                        ? 'bg-rose-50 text-rose-600 border-rose-100' 
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        <HiOutlineShieldCheck size={14} /> {u.role}
                      </span>
                    </td>
                    <td className="p-5">
                       <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                         {u._id.slice(-10)}
                       </span>
                    </td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => handleDelete(u._id)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
                        title="Delete Member"
                      >
                        <HiOutlineTrash size={20} />
                      </button>
                    </td>
                  </tr>
                )
              )) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-400 font-black uppercase tracking-widest italic text-xs">
                    No members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
