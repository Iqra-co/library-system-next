"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import http from "../../utils/httpClient";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "questions" | "reset">("email");
  const [email, setEmail] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: User enters email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email address",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await http.post("/auth/forgot-password", { email });
      if (response.data.success) {
        setStep("questions");
        Swal.fire({
          icon: "info",
          title: "Security Questions",
          text: "Please answer your security questions",
          confirmButtonColor: "#3B82F6",
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.msg || "Email not found",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: User verifies security questions
  const handleQuestionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer1 || !answer2) {
      Swal.fire({
        icon: "warning",
        title: "Answers Required",
        text: "Please answer both security questions",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await http.post("/auth/verify-security-questions", {
        email,
        answer1,
        answer2,
      });

      // If questions verified, show password reset form
      setStep("reset");
      Swal.fire({
        icon: "success",
        title: "Verified!",
        text: "Now set your new password",
        confirmButtonColor: "#10B981",
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: err.response?.data?.msg || "Security questions answers are incorrect",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: User sets new password
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Password",
        text: "Password must be at least 6 characters",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await http.post("/auth/reset-password-with-questions", {
        email,
        answer1,
        answer2,
        newPassword,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Password Reset!",
          text: "Your password has been successfully reset. Please login with your new password.",
          confirmButtonColor: "#10B981",
        }).then(() => {
          window.location.href = "/login";
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: err.response?.data?.msg || "Something went wrong",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/girl.jpg')" }}
    >
      <div className="w-full max-w-md bg-white/30 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-2">
          Reset Password
        </h1>
        <p className="text-gray-600 text-center mb-6 text-sm">
          {step === "email" && "Enter your email to get started"}
          {step === "questions" && "Answer your security questions"}
          {step === "reset" && "Set your new password"}
        </p>

        {/* Step 1: Email */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              className="w-full shadow-sm bg-white/30 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? "Searching..." : "Continue"}
            </button>
          </form>
        )}

        {/* Step 2: Security Questions */}
        {step === "questions" && (
          <form onSubmit={handleQuestionsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question 1: Your first pet's name?
              </label>
              <input
                type="text"
                className="w-full shadow-sm bg-white/30 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200"
                placeholder="Enter answer"
                value={answer1}
                onChange={(e) => setAnswer1(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question 2: Your school's name?
              </label>
              <input
                type="text"
                className="w-full shadow-sm bg-white/30 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200"
                placeholder="Enter answer"
                value={answer2}
                onChange={(e) => setAnswer2(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Answers"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-blue-600 py-2 hover:underline"
            >
              Back
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === "reset" && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <input
              type="password"
              className="w-full shadow-sm bg-white/30 p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200"
              placeholder="New Password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setEmail("");
                setAnswer1("");
                setAnswer2("");
                setNewPassword("");
              }}
              className="w-full text-blue-600 py-2 hover:underline"
            >
              Start Over
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-blue-600 font-bold hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
