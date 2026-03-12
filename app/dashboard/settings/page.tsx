"use client";
import { useState } from "react";
import { useAuthContext } from "../../../context/AuthContext"; 
import { HiOutlineWrenchScrewdriver, HiOutlineBellAlert, HiOutlineLockClosed } from "react-icons/hi2";
import Swal from "sweetalert2";

export default function SettingsPage() {
  const { user } = useAuthContext(); 
  const [settings, setSettings] = useState({
    borrowLimit: 5,
    returnDays: 14,
    lateFine: 10
  });
  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="p-6 bg-red-50 text-red-600 rounded-full shadow-inner">
          <HiOutlineLockClosed size={50} />
        </div>
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Access Denied</h2>
        <p className="text-slate-500 text-sm max-w-xs uppercase font-bold tracking-tighter">
          Only the Main Administrator can modify system-wide library configurations.
        </p>
      </div>
    );
  }
  const handleSave = () => {
    Swal.fire("Saved", "System configuration updated successfully", "success");
  };
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-slate-800 uppercase border-l-4 border-[#0099cc] pl-3 tracking-widest">
        System <span className="text-[#0099cc]">Settings</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-50 space-y-6">
          <div className="flex items-center gap-2 text-[#0099cc] font-black uppercase text-xs tracking-widest">
            <HiOutlineWrenchScrewdriver size={20} /> Operational Rules
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Books per Student</label>
            <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0099cc]/20 font-bold" value={settings.borrowLimit} onChange={(e) => setSettings({...settings, borrowLimit: parseInt(e.target.value)})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Borrow Duration (Days)</label>
            <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0099cc]/20 font-bold" value={settings.returnDays} onChange={(e) => setSettings({...settings, returnDays: parseInt(e.target.value)})} />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Late Fine (PKR)</label>
            <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0099cc]/20 font-bold" value={settings.lateFine} onChange={(e) => setSettings({...settings, lateFine: parseInt(e.target.value)})} />
          </div>

          <button onClick={handleSave} className="w-full bg-[#0099cc] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
            Update Global Config
          </button>
        </div>

        <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border border-blue-100 flex flex-col items-center justify-center text-center">
          <div className="bg-white p-4 rounded-3xl shadow-md text-[#0099cc] mb-6">
            <HiOutlineBellAlert size={40} />
          </div>
          <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest mb-3">System Automation</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight italic">
            "Values set here will globally affect all issuance logic. Books exceeding {settings.returnDays} days will be flagged as OVERDUE in administrative reports."
          </p>
        </div>
      </div>
    </div>
  );
}
