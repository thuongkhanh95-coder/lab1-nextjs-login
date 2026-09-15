"use client";

import React, { useState } from "react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Đăng nhập thành công với tài khoản: ${identifier}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/20 border border-blue-400/30 mb-3 shadow-inner">
            <svg
              className="w-7 h-7 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Đăng Nhập
          </h1>
          <p className="text-sm text-gray-300 mt-1">
            Vui lòng nhập thông tin để truy cập hệ thống
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email / Username Field */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-200 mb-1.5"
            >
              Email hoặc Username
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              required
              placeholder="name@example.com hoặc username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 mb-1.5"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-white/10"
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transform active:scale-[0.98] transition-all duration-150 text-sm sm:text-base cursor-pointer"
          >
            Đăng nhập
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-xs sm:text-sm text-gray-400">
          Chưa có tài khoản?{" "}
          <a href="#" className="text-blue-400 hover:underline font-medium">
            Đăng ký ngay
          </a>
        </div>
      </div>
    </main>
  );
}