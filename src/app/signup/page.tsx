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
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="flex flex-col min-h-screen">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-12">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center space-x-2 transition-colors mb-8 hover:text-white"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Home</span>
              </button>
              
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8" 
                   style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
                <svg className="w-10 h-10" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>Create Account</h1>
              <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Join BirthdayReminder and never miss a celebration</p>
            </div>

            {/* Signup Form */}
            <div className="backdrop-blur-sm rounded-3xl p-10 border" 
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                   borderColor: 'rgba(255, 255, 255, 0.08)',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                 }}>
              <form onSubmit={handleSignup} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.2)' }}>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium" style={{ color: '#FF6B6B' }}>{error}</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {message && (
                  <div className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(34, 211, 165, 0.1)', borderColor: 'rgba(34, 211, 165, 0.2)' }}>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium" style={{ color: '#22D3A5' }}>{message}</p>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                  <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Minimum 6 characters</p>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                </div>

                {/* Terms Notice */}
                <div className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    By creating an account, you agree to our terms of service and privacy policy. 
                    We'll help you never miss a birthday again! 🎉
                  </p>
                </div>

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={loading || !email || !password || !confirmPassword}
                  className="w-full py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{ 
                    background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
                  }}
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
                <div className="flex-1 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}></div>
                <span className="px-4 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Already have an account?</span>
                <div className="flex-1 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              </div>

              {/* Login Link */}
              <button
                onClick={() => router.push('/login')}
                className="w-full py-4 text-lg font-semibold rounded-full border-2 transition-all duration-300 transform hover:scale-105"
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: 'transparent'
                }}
              >
                Sign In Instead
              </button>
            </div>

            
          </div>
        </main>
      </div>
    </div>
  );
}