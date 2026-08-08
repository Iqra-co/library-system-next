"use client";

import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import type { UserRole } from "../types/user";
import Swal from "sweetalert2"; 

export default function RegisterPage() {
  const { registerUser } = useAuthContext();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNo: "",
    role: "student" as UserRole,
    IdNo: "",
    securityQuestion1: "",
    securityQuestion2: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { firstName, lastName, email, password, phoneNo, IdNo, securityQuestion1, securityQuestion2 } = form;
    if (!firstName || !lastName || !email || !password || !phoneNo || !IdNo || !securityQuestion1 || !securityQuestion2) {
      Swal.fire({
        icon: 'warning',
        title: 'Fields Missing',
        text: 'Please fill all required fields including security questions.',
        confirmButtonColor: '#3B82F6'
      });
      setLoading(false);
      return;
    }
    try {
      await registerUser(form);
      Swal.fire({
        icon: 'success',
        title: 'Registered!',
        text: 'User registered successfully!',
        timer: 2500,
        showConfirmButton: false
      });
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNo: "",
        role: "student",
        IdNo: "",
        securityQuestion1: "",
        securityQuestion2: "",
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.msg || err.message || "Something went wrong",
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-3 sm:p-6 md:p-8"
         style={{ backgroundImage: "url('/girl.jpg')" }}>
      
      <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl bg-white/40 backdrop-blur-md md:max-h-[92vh]">
        
        <div className="hidden md:block md:w-1/2">
          <img
            src="/design.png"
            alt="Design"
            className="h-full w-full object-cover max-h-[92vh]"
          />
        </div>

        <div className="w-full md:w-1/2 p-5 sm:p-8 flex flex-col justify-center overflow-y-auto max-h-[85vh] md:max-h-[92vh] scrollbar-thin">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:gap-3.5">
            <div className="text-center mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">Create Account</h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5">Join the Library System</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
              <input
                className="shadow-sm bg-white/60 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 text-sm transition-all placeholder:text-gray-400"
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <input
                className="shadow-sm bg-white/60 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 text-sm transition-all placeholder:text-gray-400"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>

            <input
              type="email"
              className="shadow-sm bg-white/60 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 text-sm transition-all placeholder:text-gray-400"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              className="shadow-sm bg-white/60 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 text-sm transition-all placeholder:text-gray-400"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
              <input
                className="shadow-sm bg-white/60 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 text-sm transition-all placeholder:text-gray-400"
                placeholder="Phone Number"
                value={form.phoneNo}
                onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
              />
              <input
                className="shadow-sm bg-white/60 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 text-sm transition-all placeholder:text-gray-400"
                placeholder="ID Number"
                value={form.IdNo}
                onChange={(e) => setForm({ ...form, IdNo: e.target.value })}
              />
            </div>

            <select
              className="shadow-sm bg-white/60 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 cursor-pointer text-sm transition-all text-gray-700"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>

            <div className="border-t border-gray-200/60 pt-2.5 mt-1">
              <p className="text-xs font-bold text-gray-700 mb-2">Security Questions (for password recovery):</p>
              <div className="flex flex-col gap-2">
                <input
                  className="shadow-sm bg-white/60 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 w-full text-sm transition-all placeholder:text-gray-400"
                  placeholder="Answer 1: Your first pet's name?"
                  value={form.securityQuestion1}
                  onChange={(e) => setForm({ ...form, securityQuestion1: e.target.value })}
                />
                <input
                  className="shadow-sm bg-white/60 p-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 w-full text-sm transition-all placeholder:text-gray-400"
                  placeholder="Answer 2: Your school's name?"
                  value={form.securityQuestion2}
                  onChange={(e) => setForm({ ...form, securityQuestion2: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-base shadow-md hover:bg-blue-700 hover:shadow-lg transition-all mt-1 active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "REGISTERING..." : "REGISTER"}
            </button>
            <p className="text-center text-xs text-gray-600 mt-1">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 font-bold hover:underline transition-all">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
