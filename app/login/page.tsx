"use client";

import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import Link from "next/link"; 
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { loginUser } = useAuthContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email.trim(), password.trim());
      Swal.fire({
        title: 'Success!',
        text: 'Login successful',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        title: 'Error!',
        text: err.response?.data?.msg || err.message || "Unknown error",
        icon: 'error',
        confirmButtonColor: '#EF4444',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-3 sm:p-6 md:p-8 overflow-hidden" 
         style={{ backgroundImage: "url('/girl.jpg')" }}>
      
      <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl bg-white/40 backdrop-blur-md md:max-h-[92vh]">
        
        <div className="hidden md:block md:w-1/2">
          <img 
            src="/design.png" 
            className="h-full w-full object-cover max-h-[92vh]" 
            alt="design" 
          />
        </div>

        <div className="w-full md:w-1/2 p-5 sm:p-8 flex flex-col justify-center overflow-y-auto max-h-[85vh] md:max-h-[92vh] scrollbar-thin">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 sm:gap-4">
            <div className="text-center mb-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">Welcome</h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-0.5 font-medium">Please login to your account</p>
            </div>
            
            <div className="space-y-3">
              <input
                type="email"
                required
                placeholder="Email Address"
                className="w-full shadow-sm bg-white/60 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all placeholder:text-gray-400"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                placeholder="Password"
                className="w-full shadow-sm bg-white/60 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 text-sm transition-all placeholder:text-gray-400"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="text-right -mt-1">
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-xs sm:text-sm text-blue-600 hover:underline font-semibold transition-all"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-base shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] transition-all ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
            
            <div className="text-center mt-1">
              <p className="text-xs sm:text-sm text-gray-600">
                Don't have an account?{" "}
                <Link 
                  href="/" 
                  className="text-blue-600 font-bold hover:text-blue-800 hover:underline transition-all"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
