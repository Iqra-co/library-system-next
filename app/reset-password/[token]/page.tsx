"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { resetPassword } from "../../../services/auth.service"; 
import Swal from "sweetalert2";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return Swal.fire("Error", "Passwords don't match", "error");

    setLoading(true);
    try {
      await resetPassword(token as string, password);
      await Swal.fire("Success", "Password updated!", "success");
      router.push("/login");
    } catch (err: any) {
      Swal.fire("Error", err.response?.data?.msg || "Link expired", "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <h1 className="text-2xl font-bold text-blue-700 uppercase italic mb-6 border-l-4 border-blue-700 pl-3">
          Set New <span className="text-slate-800">Password</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="password" placeholder="New Password" required
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-black"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input 
            type="password" placeholder="Confirm Password" required
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-black"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold uppercase tracking-widest">
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
