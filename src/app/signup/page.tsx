'use client';

import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else if (data.user && !data.user.email_confirmed_at) {
      setMessage('Please check your email to confirm your account before logging in.');
    } else {
      // User is signed up and confirmed, redirect to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-gray-50">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 left-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-3000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-1000"></div>
        <div className="absolute top-2/3 left-1/2 w-56 h-56 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-5000"></div>
      </div>

      <div className="flex flex-col min-h-screen">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Home</span>
              </button>
              
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in-up">Create Account</h1>
              <p className="text-gray-600 animate-fade-in-up" style={{animationDelay: '0.1s'}}>Join BirthdayReminder and never miss a celebration</p>
            </div>

            {/* Signup Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <form onSubmit={handleSignup} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {message && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-fade-in">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-700 text-sm font-medium">{message}</p>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white/70 backdrop-blur-sm"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white/70 backdrop-blur-sm"
                  />
                  <p className="text-xs text-gray-500">Minimum 6 characters</p>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white/70 backdrop-blur-sm"
                  />
                </div>

                {/* Terms Notice */}
                <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    By creating an account, you agree to our terms of service and privacy policy. 
                    We'll help you never miss a birthday again! 🎉
                  </p>
                </div>

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={loading || !email || !password || !confirmPassword}
                  className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-sm text-gray-500">Already have an account?</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* Login Link */}
              <button
                onClick={() => router.push('/login')}
                className="w-full btn-outline py-4 text-lg"
              >
                Sign In Instead
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                  <span>Generate shareable birthday collection links</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse animation-delay-1000"></div>
                  <span>Export birthdays to your calendar automatically</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse animation-delay-2000"></div>
                  <span>Receive email reminders before each birthday</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white border-t border-gray-800 relative z-10">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center">
              <div className="text-2xl font-bold mb-4">
                Birthday<span className="text-pink-500">Reminder</span>
              </div>
              <p className="text-gray-400">
                © 2025 BirthdayReminder. Never miss a birthday again.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Created by Carl Lichtl
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}