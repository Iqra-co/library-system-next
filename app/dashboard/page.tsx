"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { getAdminReport, getAllBooksAdmin, getAllBorrowsAdmin, getAllUsersAdmin } from "../../services/admin.service";
import { returnBook } from "../../services/borrow.service";
import { 
  HiOutlineBookOpen, HiOutlineClock, HiOutlineCalendarDays, 
  HiChevronDown, HiChevronUp, HiOutlineArrowPathRoundedSquare, HiOutlineEye,
  HiOutlineUserGroup, HiOutlineUserCircle, HiOutlineSparkles
} from "react-icons/hi2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Link from "next/link";
import Swal from "sweetalert2";

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuthContext();
  const [stats, setStats] = useState({ totalBooks: 0, issuedToday: 0, overdue: 0, totalUsers: 0 });
  const [books, setBooks] = useState<any[]>([]);
  const [borrows, setBorrows] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTableOpen, setIsTableOpen] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportRes, booksRes, borrowsRes, usersRes] = await Promise.all([
        getAdminReport(),
        getAllBooksAdmin(),
        getAllBorrowsAdmin(),
        getAllUsersAdmin()
      ]);
      const today = new Date().toLocaleDateString();
      const todayCount = borrowsRes.borrows?.filter((b: any) => 
        new Date(b.issueDate).toLocaleDateString() === today
      ).length || 0;

      setStats({
        totalBooks: booksRes.books?.length || 0,
        issuedToday: todayCount,
        overdue: reportRes.report?.overdue || 0,
        totalUsers: usersRes.users?.length || 0
      });
      setBooks(booksRes.books || []);
      setBorrows(borrowsRes.borrows || []);
      setUsers(usersRes.users?.slice(0, 5) || []);
    } catch (err: any) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!authLoading && user) fetchData();
  }, [user, authLoading]);

  const handleReturn = async (borrowId: string) => {
    const result = await Swal.fire({
      title: "Confirm Return?",
      text: "Mark this book as returned?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1d4ed8", 
    });
    if (result.isConfirmed) {
      try {
        const res = await returnBook(borrowId);
        if (res.success) {
          Swal.fire({ title: "Returned!", icon: "success", timer: 2000, showConfirmButton: false });
          fetchData(); 
        }
      } catch (err: any) {
        Swal.fire("Error", "Action failed", "error");
      }
    }
  };
  if (authLoading || loading) return <div className="p-10 text-center font-bold text-blue-500 animate-pulse uppercase tracking-widest text-xs">Syncing Library Data...</div>;
const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace("/api/v1", "") || "http://localhost:5000";
  return (
    <div className="p-4 sm:p-6 space-y-8 bg-gray-50 min-h-screen animate-in fade-in duration-500 text-slate-800">
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-lg text-white">
                <HiOutlineSparkles size={28} />
            </div>
            <div>
                <h1 className="text-2xl font-bold uppercase italic tracking-tight">
                    Welcome, <span className="text-blue-500">{user?.firstName} {user?.lastName}</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Role: {user?.role} • Logged in at {new Date().toLocaleTimeString()}</p>
            </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Inventory" value={stats.totalBooks} icon={<HiOutlineBookOpen size={20}/>} />
        <StatCard label="Issued Today" value={stats.issuedToday} icon={<HiOutlineCalendarDays size={20}/>} />
        <StatCard label="Overdue Books" value={stats.overdue} icon={<HiOutlineClock size={20}/>} />
        <StatCard label="Total Members" value={stats.totalUsers} icon={<HiOutlineUserGroup size={20}/>} />
      </div>
      <div className="space-y-4">
  <h2 className="text-sm font-bold text-slate-700 uppercase border-l-4 border-blue-500 pl-3 tracking-widest">New Arrivals</h2>
  <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
    <Swiper
      spaceBetween={20} slidesPerView={1} autoplay={{ delay: 3000 }} pagination={{ clickable: true }} navigation={true}
      breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }}
      modules={[Autoplay, Pagination, Navigation]} className="mySwiper !pb-12"
    >
      {books.map((book) => {
        const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace("/api/v1", "") || "http://localhost:5000";
        const imageName = book.cover ? book.cover.replace(/\\/g, "/").split("/").pop() : null;
        const fullImageUrl = `${backendBaseUrl}/uploads/${imageName}`;
        return (
          <SwiperSlide key={book._id}>
            <div className="group bg-white rounded border border-slate-200 overflow-hidden hover:border-blue-700 transition-all flex flex-col h-[280px]">
              <div className="h-40 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                {book.cover ? (
                  <img 
                    src={fullImageUrl} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co";
                    }}
                  />
                ) : (
                  <HiOutlineBookOpen size={40} className="text-slate-300" />
                )}
              </div>
              <div className="p-3 bg-white border-t border-slate-50 flex-grow">
                <h4 className="text-[11px] font-bold text-slate-800 uppercase line-clamp-2 leading-tight h-8">{book.title}</h4>
                <p className="text-[9px] text-blue-700 font-bold uppercase mt-2 tracking-widest">{book.category}</p>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  </div>
</div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <button onClick={() => setIsTableOpen(!isTableOpen)} className="w-full flex items-center justify-between p-4 bg-blue-500 text-white font-bold uppercase tracking-widest text-xs">
                    <span>Lending Records</span>
                    {isTableOpen ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}
                </button>
                {isTableOpen && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b">
                                <tr>
                                    <th className="p-4">Borrower</th>
                                    <th className="p-4">Book Entity</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {borrows.slice(0, 5).map((b) => (
                                    <tr key={b._id} className="hover:bg-slate-50">
                                        <td className="p-4 font-bold uppercase text-slate-700">{b.user?.firstName} {b.user?.lastName}</td>
                                        <td className="p-4 uppercase text-slate-500 italic">{b.book?.title}</td>
                                        <td className="p-4 flex justify-center gap-2">
                                            <Link href="/dashboard/reports" className="p-1.5 bg-blue-50 text-blue-500 rounded hover:bg-blue-600 hover:text-white transition-all"><HiOutlineEye size={16}/></Link>
                                            {!b.returned && (
                                                <button onClick={() => handleReturn(b._id)} className="bg-blue-500 text-white px-3 py-1 rounded font-bold text-[9px] uppercase hover:bg-blue-800 transition-all">
                                                    Return
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest">Recent Members</h3>
                <Link href="/admin/users" className="text-[10px] underline hover:text-blue-400">View All</Link>
            </div>
            <div className="p-4 space-y-4">
                {users.map((u) => (
                    <div key={u._id} className="flex items-center gap-3 border-b border-slate-50 pb-3 last:border-0">
                        <div className="w-9 h-9 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
                            <HiOutlineUserCircle size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-800 uppercase truncate">{u.firstName} {u.lastName}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{u.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
function StatCard({ label, value, icon }: { label: string; value: number; icon: any }) {
  return (
    <div className="bg-blue-500 text-white p-5 rounded-lg shadow-md flex items-center gap-4 transition-transform hover:scale-105 border-b-4 border-blue-900">
      <div className="bg-white/20 p-3 rounded-lg">{icon}</div>
      <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">{label}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
      </div>
    </div>
  );
}
