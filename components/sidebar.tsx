"use client";
import Link from "next/link";
import { useAuthContext } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { 
  HiOutlineSquares2X2, HiOutlineBookOpen, HiOutlinePlusCircle, 
  HiOutlineClipboardDocumentList, HiOutlineArrowLeftOnRectangle,
  HiXMark, HiOutlineUserGroup, HiOutlineWrenchScrewdriver, HiOutlineClock 
} from "react-icons/hi2";
import { MdOutlineLibraryBooks } from "react-icons/md";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  isCloseable?: boolean;
  setisCloseable?: (val: boolean) => void;
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
    // Both admin and staff can view the book list and issue books.
    menuItems.push(
      { name: "Book List", path: "/books", icon: <HiOutlineBookOpen size={22} /> },
      { name: "Issue Book", path: "/dashboard/issue-book", icon: <HiOutlinePlusCircle size={22} /> }
    );

    // Admin-only features
    if (user.role === "admin") {
      menuItems.push(
        { name: "Add New Book", path: "/books/add", icon: <HiOutlinePlusCircle size={22} /> },
        { name: "Reports", path: "/admin/reports", icon: <HiOutlineClipboardDocumentList size={22} /> },
        { name: "Pending Requests", path: "/admin/pending-requests", icon: <HiOutlineClock size={22} /> },
        { name: "Manage Users", path: "/admin/users", icon: <HiOutlineUserGroup size={22} /> },
        { name: "System Settings", path: "/dashboard/settings", icon: <HiOutlineWrenchScrewdriver size={22} /> }
      );
    }
  } else if (user.role === "student") {
    menuItems.push(
      { name: "Browse Catalog", path: "/dashboard/student/catalog", icon: <HiOutlineBookOpen size={22} /> },
      { name: "My Borrowed Books", path: "/dashboard/student/my-borrows", icon: <HiOutlineClipboardDocumentList size={22} /> }
    );
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
      
      {/* 
        FIX: Dynamic layout switching 
        - Mobile views use absolute slide transitions.
        - Desktop views switch width between 'w-72' (expanded) and 'w-20' (mini icons).
      */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-100 shadow-2xl 
        transition-all duration-300 ease-in-out flex flex-col h-full
        lg:static lg:shadow-none lg:translate-x-0
        ${isOpen 
          ? "translate-x-0 w-72" 
          : "-translate-x-full lg:translate-x-0 lg:w-20"
        }
      `}>
        
        {/* Header Block */}
        <div className="p-6 mb-4 flex justify-between items-center border-b border-slate-50 overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="bg-[#0099cc] p-2 rounded-lg text-white flex-shrink-0">
              <MdOutlineLibraryBooks size={24} />
            </div>
            <h2 className={`text-xl font-bold text-slate-800 tracking-tight italic transition-all duration-200 ${!isOpen && "lg:opacity-0 lg:w-0 overflow-hidden"}`}>
              Library<span className="text-[#0099cc]">Pro</span>
            </h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400">
            <HiXMark size={24} />
          </button>
        </div>

        {/* User Card Panel */}
        <div className="px-4 mb-6 overflow-hidden">
          <div className={`bg-blue-50 p-4 rounded-xl border border-blue-100 transition-all duration-200 ${!isOpen && "lg:bg-transparent lg:border-none lg:p-2"}`}>
            <p className={`text-[9px] font-bold text-[#0099cc] uppercase tracking-widest mb-1 transition-all ${!isOpen && "lg:hidden"}`}>{user.role}</p>
            <p className={`text-sm font-bold text-slate-800 truncate uppercase ${!isOpen && "lg:text-[10px] lg:text-center lg:bg-blue-100 lg:p-1 lg:rounded-full lg:text-blue-600 lg:w-8 lg:h-8 lg:flex lg:items-center lg:justify-center lg:mx-auto"}`}>
              {isOpen ? `${user.firstName} ${user.lastName}` : user.firstName?.charAt(0)}
            </p>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center rounded-lg font-bold transition-all duration-200 py-3 ${
                  isOpen ? "gap-4 px-4 justify-start" : "justify-center px-0 lg:w-12 lg:h-12 lg:mx-auto"
                } ${
                  isActive 
                  ? "bg-[#0099cc] text-white shadow-lg shadow-blue-100" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#0099cc]"
                }`}
                title={!isOpen ? item.name : ""} // Hover karne par naam dikhane ke liye tool-tip
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className={`text-xs uppercase tracking-wide leading-none whitespace-nowrap transition-all duration-200 ${!isOpen && "lg:hidden"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Control Footer */}
        <div className="mt-auto p-4 w-full border-t border-slate-50">
          <button
            onClick={logoutUser}
            className={`flex items-center text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all font-bold group py-3 ${
              isOpen ? "gap-4 px-4 w-full" : "justify-center w-12 h-12 mx-auto"
            }`}
            title={!isOpen ? "Logout" : ""}
          >
            <span className="flex-shrink-0"><HiOutlineArrowLeftOnRectangle size={22} /></span>
            <span className={`text-xs uppercase leading-none whitespace-nowrap ${!isOpen && "lg:hidden"}`}>Logout</span>
          </button>
        </div>

        {/* Floating logout shown when sidebar is closed (mobile) */}
        {!isOpen && (
          <button
            onClick={logoutUser}
            className="lg:hidden fixed bottom-5 right-4 z-50 bg-white p-3 rounded-full shadow-lg text-rose-600 border border-rose-50"
            title="Logout"
          >
            <HiOutlineArrowLeftOnRectangle size={20} />
          </button>
        )}
      </aside>
    </>
  );
}
