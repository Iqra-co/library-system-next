"use client";

import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/services/auth.service";

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

 
//   const handleForgotPassword = () => {
//   Swal.fire({
//     title: 'Reset Password',
//     text: 'Enter your registered email address',
//     input: 'email',
//     inputPlaceholder: 'email@example.com',
//     showCancelButton: true,
//     confirmButtonText: 'Send Reset Link',
//     confirmButtonColor: '#2563eb',
//     showLoaderOnConfirm: true,
//     preConfirm: async (email) => {
//       try {
        
//         const res = await forgotPassword(email);
//         return res;
//       } catch (error: any) {
//         Swal.showValidationMessage(`Request failed: ${error.response?.data?.msg || error.message}`);
//       }
//     },
//     allowOutsideClick: () => !Swal.isLoading()
//   }).then((result) => {
//     if (result.isConfirmed) {
//       Swal.fire('Sent!', 'Please check your email for the reset link.', 'success');
//     }
//   });
// };


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4 sm:p-8" 
         style={{ backgroundImage: "url('/girl.jpg')" }}>
      <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden max-w-5xl w-full bg-white/95 backdrop-blur-md">
        <div className="hidden md:block md:w-[55%]">
          <img 
            src="/design.png" 
            className="h-full w-full object-cover min-h-[500px]" 
            alt="design" 
          />
        </div>
        <div className="w-full md:w-[45%] p-8 sm:p-14 flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="text-center mb-2">
              <h1 className="text-4xl font-extrabold text-blue-600 mb-2">Welcome</h1>
              <p className="text-gray-500 font-medium">Please login to your account</p>
            </div>
            <div className="space-y-4">
              <input
                type="email"
                required
                placeholder="Email Address"
                className="w-full shadow-sm bg-gray-100 p-4 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                required
                placeholder="Password"
                className="w-full shadow-sm bg-gray-100 p-4 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            {/* <div className="text-right">
              <button 
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div> */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
            <div className="text-center mt-4">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link 
                  href="/" 
                  className="text-blue-600 font-bold hover:text-blue-800 hover:underline transition"
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
