"use client";
import Link from "next/link";
import { useAuthContext } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import { 
  HiOutlineSquares2X2, 
  HiOutlineBookOpen, 
  HiOutlinePlusCircle, 
  HiOutlineClipboardDocumentList,
  HiOutlineArrowLeftOnRectangle,
  HiXMark,
  HiOutlineUserGroup,
  HiOutlineWrenchScrewdriver 
} from "react-icons/hi2";
import { MdOutlineLibraryBooks } from "react-icons/md";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}
export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user, logoutUser } = useAuthContext();
  const pathname = usePathname();
  if (!user) return null;
  const menuItems = [];
  menuItems.push({ 
    name: "Dashboard", 
    path: user.role === 'student' ? "/dashboard/student" : "/dashboard", 
    icon: <HiOutlineSquares2X2 size={22} /> 
  });
  if (user.role === "admin" || user.role === "staff") {
    menuItems.push(
      { name: "Book List", path: "/books", icon: <HiOutlineBookOpen size={22} /> },
      { name: "Add New Book", path: "/books/add", icon: <HiOutlinePlusCircle size={22} /> },
      { name: "Reports", path: "/admin/reports", icon: <HiOutlineClipboardDocumentList size={22} /> },
      { name: "Issue Book", path: "/dashboard/issue-book", icon: <HiOutlinePlusCircle size={22} /> }
    );
    if (user.role === "admin") {
      menuItems.push(
        { name: "Manage Users", path: "/admin/users", icon: <HiOutlineUserGroup size={22} /> },
        { name: "System Settings", path: "/dashboard/settings", icon: <HiOutlineWrenchScrewdriver size={22} /> }
      );
    }
  } 
  else if (user.role === "student") {
    menuItems.push(
      { name: "Browse Catalog", path: "/dashboard/student/catalog", icon: <HiOutlineBookOpen size={22} /> },
      { name: "My Borrowed Books", path: "/dashboard/student/my-borrows", icon: <HiOutlineClipboardDocumentList size={22} /> }
    );
  }
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 shadow-2xl transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:shadow-none lg:block
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 mb-4 flex justify-between items-center border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-[#0099cc] p-2 rounded-lg text-white">
              <MdOutlineLibraryBooks size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight italic">Library<span className="text-[#0099cc]">Pro</span></h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400">
            <HiXMark size={24} />
          </button>
        </div>
        <div className="px-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-[9px] font-bold text-[#0099cc] uppercase tracking-widest mb-1">{user.role}</p>
            <p className="text-sm font-bold text-slate-800 truncate uppercase">{user.firstName} {user.lastName}</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
                  isActive 
                  ? "bg-[#0099cc] text-white shadow-lg shadow-blue-100" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#0099cc]"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="text-xs uppercase tracking-wide leading-none">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-6 w-full px-4">
          <button
            onClick={logoutUser}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all font-bold group"
          >
            <HiOutlineArrowLeftOnRectangle size={22} />
            <span className="text-xs uppercase leading-none">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
