// // "use client";

// // import { useState } from "react";
// // import { logoutApi } from "../../services/auth.service";

// // export default function ForgotPassword() {
// //   const [email, setEmail] = useState("");

// //   const submit = async (e: any) => {
// //     e.preventDefault();

// //     await logoutApi();

// //     alert("Reset email sent");
// //   };

// //   return (
// //     <form onSubmit={submit}>
// //       <h1>Forgot Password</h1>

// //       <input
// //         placeholder="Email"
// //         onChange={(e) => setEmail(e.target.value)}
// //       />

// //       <button type="submit">Send</button>
// //     </form>
// //   );
// // }

// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { http } from "../../utils/http"; 
// import Swal from "sweetalert2";

// export default function ResetPassword() {
//   const [formData, setFormData] = useState({ email: "", newPassword: "", confirmPassword: "" });
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleReset = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (formData.newPassword !== formData.confirmPassword) {
//       return Swal.fire("Error", "Passwords do not match!", "error");
//     }

//     setLoading(true);
//     try {
//       // Backend API jo direct password update karegi
//       const res = await http.post("/auth/reset-password-direct", {
//         email: formData.email,
//         password: formData.newPassword
//       });

//       if (res.data.success) {
//         await Swal.fire("Success", "Password updated successfully!", "success");
//         router.push("/login");
//       }
//     } catch (err: any) {
//       Swal.fire("Error", err.response?.data?.msg || "Reset failed", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
//         <h1 className="text-2xl font-bold text-blue-700 uppercase italic mb-6 border-l-4 border-blue-700 pl-3">
//           Reset <span className="text-slate-800">Password</span>
//         </h1>

//         <form onSubmit={handleReset} className="space-y-5">
//           <div>
//             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
//             <input 
//               required type="email" 
//               className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
//               onChange={(e) => setFormData({...formData, email: e.target.value})}
//             />
//           </div>

//           <div>
//             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Password</label>
//             <input 
//               required type="password" 
//               className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
//               onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
//             />
//           </div>

//           <div>
//             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confirm New Password</label>
//             <input 
//               required type="password" 
//               className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20"
//               onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
//             />
//           </div>

//           <button 
//             type="submit" disabled={loading}
//             className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-100 disabled:bg-slate-300"
//           >
//             {loading ? "UPDATING..." : "UPDATE PASSWORD"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
