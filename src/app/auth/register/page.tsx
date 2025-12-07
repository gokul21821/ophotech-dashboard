'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    try {
      await register(email, username, password);
      setSuccess(true);
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/icons/logo.svg"
            alt="Logo"
            width={48}
            height={48}
            priority
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#fcd5ac] shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium text-[#0B1B2B] mb-2">Register</h1>
            <p className="text-[#3A4A5F]">Create your Ophotech account</p>
          </div>

          {/* Success message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm font-medium">Account created! Redirecting to dashboard...</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-[#D9751E]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E] focus:border-transparent text-[#0B1B2B] placeholder:text-[#3A4A5F] bg-white transition-all duration-200"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-[#D9751E]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E] focus:border-transparent text-[#0B1B2B] placeholder:text-[#3A4A5F] bg-white transition-all duration-200"
                  placeholder="johndoe"
                  disabled={isLoading}
                />
              </div>
              <p className="mt-2 text-xs text-[#3A4A5F]">Minimum 3 characters</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[#D9751E]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E] focus:border-transparent text-[#0B1B2B] placeholder:text-[#3A4A5F] bg-white transition-all duration-200"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-[#3A4A5F] hover:text-[#D9751E] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-[#3A4A5F]">Minimum 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-[#0B1B2B] mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[#D9751E]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#fcd5ac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D9751E] focus:border-transparent text-[#0B1B2B] placeholder:text-[#3A4A5F] bg-white transition-all duration-200"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-[#D9751E] hover:bg-[#c1651a] disabled:bg-[#d9a07a] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
            >
              {isLoading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-[#3A4A5F] text-sm">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-[#D9751E] hover:text-[#c1651a] font-semibold transition-colors"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}