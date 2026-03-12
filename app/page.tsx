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
  });
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { firstName, lastName, email, password, phoneNo, IdNo } = form;
    if (!firstName || !lastName || !email || !password || !phoneNo || !IdNo) {
      Swal.fire({
        icon: 'warning',
        title: 'Fields Missing',
        text: 'Please fill all required fields.',
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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 sm:p-6"
         style={{ backgroundImage: "url('/girl.jpg')" }}>
      <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl bg-white/95 backdrop-blur-md min-h-[600px]">
                <div className="hidden md:block md:w-1/2">
          <img
            src="/design.png"
            alt="Design"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="text-center mb-2">
              <h1 className="text-3xl font-bold text-blue-600">Create Account</h1>
              <p className="text-gray-500 text-sm">Join the Library System</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="shadow-sm bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200"
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <input
                className="shadow-sm bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <input
              type="email"
              className="shadow-sm bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              className="shadow-sm bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="shadow-sm bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200"
                placeholder="Phone Number"
                value={form.phoneNo}
                onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
              />
              <input
                className="shadow-sm bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200"
                placeholder="ID Number"
                value={form.IdNo}
                onChange={(e) => setForm({ ...form, IdNo: e.target.value })}
              />
            </div>

            <select
              className="shadow-sm bg-gray-100 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 cursor-pointer"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 transition-all mt-2 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "REGISTERING..." : "REGISTER"}
            </button>
            <p className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 font-bold hover:underline">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
