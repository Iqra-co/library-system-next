"use client";
import { HiMenu } from "react-icons/hi";
import { useAuthContext } from "../context/AuthContext";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuthContext();

  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
<button 
  onClick={onMenuClick}
  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
>
  <HiMenu size={28} />
</button>
  <h1 className="text-lg font-bold text-slate-800 hidden sm:block">
          Library Management System
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-900">{user?.firstName} {user?.lastName}</p>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{user?.role}</p>
        </div>
        <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-bold border border-blue-200">
          {user?.firstName?.charAt(0)}
        </div>
      </div>
    </nav>
  );
}
