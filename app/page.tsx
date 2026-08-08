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
    // overflow-hidden lagaya taake main screen par kabhi scroll na aaye
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-2 sm:p-4 overflow-hidden"
         style={{ backgroundImage: "url('/girl.jpg')" }}>
      
      {/* Box ki height ko fully flexible kar diya aur inner content ke liye scroll open rakha agar screen bohat choti ho */}
      <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl bg-white/30 backdrop-blur-md max-h-[90vh]">
        
        {/* Left side design image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="/design.png"
            alt="Design"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right side form: Padding thoda set kiya taake spacing badi rahe aur height bhi na barhe */}
        <div className="w-full md:w-1/2 p-4 sm:p-8 flex flex-col justify-center overflow-y-auto max-h-[90vh]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="text-center mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">Create Account</h1>
              <p className="text-gray-600 text-xs sm:text-sm">Join the Library System</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="shadow-sm bg-white/50 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 text-sm"
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <input
                className="shadow-sm bg-white/50 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 text-sm"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>

            <input
              type="email"
              className="shadow-sm bg-white/50 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 text-sm"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              className="shadow-sm bg-white/50 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 text-sm"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="shadow-sm bg-white/50 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 text-sm"
                placeholder="Phone Number"
                value={form.phoneNo}
                onChange={(e) => setForm({ ...form, phoneNo: e.target.value })}
              />
              <input
                className="shadow-sm bg-white/50 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 text-sm"
                placeholder="ID Number"
                value={form.IdNo}
                onChange={(e) => setForm({ ...form, IdNo: e.target.value })}
              />
            </div>

            <select
              className="shadow-sm bg-white/50 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 cursor-pointer text-sm"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>

            <div className="border-t pt-3 mt-1">
              <p className="text-xs font-semibold text-gray-700 mb-2">Security Questions (for password recovery):</p>
              <input
                className="shadow-sm bg-white/50 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 w-full mb-2 text-sm"
                placeholder="Answer 1: Your first pet's name?"
                value={form.securityQuestion1}
                onChange={(e) => setForm({ ...form, securityQuestion1: e.target.value })}
              />
              <input
                className="shadow-sm bg-white/50 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 w-full text-sm"
                placeholder="Answer 2: Your school's name?"
                value={form.securityQuestion2}
                onChange={(e) => setForm({ ...form, securityQuestion2: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold text-base shadow-lg hover:bg-blue-700 transition-all mt-1 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "REGISTERING..." : "REGISTER"}
            </button>
            <p className="text-center text-xs text-gray-600 mt-1">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 font-bold hover:underline">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
