"use client";
import { useEffect, useState } from "react";
import { getAllBorrowsAdmin } from "../../../services/admin.service";
import { 
  HiOutlineBookOpen, HiOutlineUser, HiOutlineCalendarDays, 
  HiOutlineCheckCircle, HiOutlineClock, HiOutlineExclamationTriangle 
} from "react-icons/hi2";
export default function ReportsPage() {
  const [borrows, setBorrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOverdue, setFilterOverdue] = useState(false);

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const res = await getAllBorrowsAdmin();
        setBorrows(res.borrows || []);
      } catch (err) {
        console.error("Error fetching borrows:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBorrows();
  }, []);

  const filteredData = filterOverdue 
    ? borrows.filter(item => !item.returned && item.dueDate && new Date(item.dueDate) < new Date())
    : borrows;

  if (loading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center animate-pulse">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-xs">Accessing Library Logs...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-blue-500 p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <HiOutlineBookOpen size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-[0.15em]">Issuance Reports</h1>
              <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest opacity-80">Inventory Circulation Tracking</p>
            </div>
          </div>
          
          <button 
            onClick={() => setFilterOverdue(!filterOverdue)}
            className={`px-6 py-2.5 rounded-xl font-black text-[10px] transition-all flex items-center gap-2 tracking-widest border-2 ${
              filterOverdue 
              ? "bg-red-500 border-red-400 text-white shadow-lg animate-pulse" 
              : "bg-white/10 border-white/20 text-white hover:bg-white/20"
            }`}
          >
            <HiOutlineExclamationTriangle size={16} />
            {filterOverdue ? "SHOWN: OVERDUE" : "FILTER OVERDUE"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100">
              <tr>
                <th className="p-6">Book Entity</th>
                <th className="p-6">Member</th>
                <th className="p-6 text-center">Issue Date</th>
                <th className="p-6 text-center">Status</th>
                <th className="p-6 text-right">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((item) => {
                const isOverdue = !item.returned && item.dueDate && new Date(item.dueDate) < new Date();
                
                return (
                  <tr key={item._id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                          <HiOutlineBookOpen size={20} />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-xs uppercase tracking-tight">{item.book?.title || "N/A"}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">ISBN: {item.book?.isbn || "---"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        <HiOutlineUser size={16} className="text-blue-400" />
                        <span className="text-xs font-black uppercase tracking-tight text-slate-700">{item.user?.firstName} {item.user?.lastName}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                        {new Date(item.issueDate).toLocaleDateString('en-GB')}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      {item.returned ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black bg-emerald-600 text-white shadow-md shadow-emerald-100 uppercase tracking-widest">
                          <HiOutlineCheckCircle size={14} /> Completed
                        </span>
                      ) : isOverdue ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black bg-red-600 text-white shadow-md shadow-red-100 animate-pulse uppercase tracking-widest">
                          <HiOutlineExclamationTriangle size={14} /> Critical
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black bg-blue-500 text-white shadow-md shadow-blue-100 uppercase tracking-widest ring-2 ring-blue-100">
                          <HiOutlineClock size={14} /> Issuance
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <span className={`text-[11px] font-black px-2 py-1 rounded ${isOverdue ? "text-red-600 bg-red-50 underline decoration-2" : "text-slate-700"}`}>
                        {item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-GB') : "---"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="p-20 text-center">
               <HiOutlineBookOpen size={48} className="mx-auto text-slate-100 mb-4" />
               <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs italic">
                 {filterOverdue ? "No overdue assets found." : "No issuance history available."}
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
