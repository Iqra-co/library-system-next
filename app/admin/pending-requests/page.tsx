"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPendingRequests, approveOnline } from "@/services/borrow.service";
import { getAllUsersAdmin } from "@/services/admin.service";
import Swal from "sweetalert2";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi2";

export default function PendingRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignMap, setAssignMap] = useState<Record<string, string>>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reqRes, usersRes] = await Promise.all([getPendingRequests(), getAllUsersAdmin()]);
      if (reqRes?.success) setRequests(reqRes.data || []);
      if (usersRes?.success) setUsers(usersRes.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (borrowId: string) => {
    const assignedTo = assignMap[borrowId];
    if (!assignedTo) return Swal.fire("Choose Assignee", "Please select a user to assign this request to.", "warning");
    try {
      const res = await approveOnline(borrowId, assignedTo);
      if (res?.success) {
        Swal.fire("Approved", "Request approved successfully.", "success");
        fetchData();
      } else {
        Swal.fire("Failed", res?.message || "Approve failed.", "error");
      }
    } catch (err: any) {
      Swal.fire("Error", err?.response?.data?.message || "Operation failed", "error");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading pending requests...</div>;

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => router.push('/dashboard')} className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0099cc] font-bold text-xs uppercase">
        <HiChevronLeft size={18} /> Back to Dashboard
      </button>
      <h1 className="text-xl font-bold">Pending Online Requests</h1>
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b">
            <tr>
              <th className="p-4">Borrower</th>
              <th className="p-4">Book</th>
              <th className="p-4">Requested At</th>
              <th className="p-4">Assign To</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? requests.map((r) => (
              <tr key={r._id} className="border-b hover:bg-slate-50">
                <td className="p-4">{r.user?.firstName} {r.user?.lastName} <div className="text-[10px] text-slate-400">{r.user?.email}</div></td>
                <td className="p-4">{r.book?.title}</td>
                <td className="p-4">{new Date(r.issueDate || r.createdAt || r._id).toLocaleString()}</td>
                <td className="p-4">
                  <select value={assignMap[r._id] || ""} onChange={(e) => setAssignMap({...assignMap, [r._id]: e.target.value})} className="p-2 border rounded">
                    <option value="">Select user</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.firstName} {u.lastName} ({u.role})</option>
                    ))}
                  </select>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/borrow/view/${r._id}`} className="px-3 py-1 bg-slate-100 rounded text-xs">Open</Link>
                    <button onClick={() => handleApprove(r._id)} className="px-3 py-1 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700">Approve & Assign</button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="p-10 text-center text-slate-400">No pending online requests.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
