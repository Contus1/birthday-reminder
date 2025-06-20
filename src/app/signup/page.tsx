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

    try {
      // Check if user already exists by attempting to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'dummy-password-check'
      });

      // If sign in succeeds or fails with "Invalid login credentials", user exists
      if (signInData?.user || (signInError && signInError.message.includes('Invalid login credentials'))) {
        setError('An account with this email already exists. Please sign in instead.');
        setLoading(false);
        return;
      }

      // If we get here, user doesn't exist, proceed with signup
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      setLoading(false);

      if (error) {
        // Handle specific signup errors
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Password should be at least 6 characters')) {
          setError('Password must be at least 6 characters long');
        } else if (error.message.includes('Invalid email')) {
          setError('Please enter a valid email address');
        } else {
          setError(error.message);
        }
      } else if (data.user && !data.user.email_confirmed_at) {
        setMessage('Please check your email to confirm your account before logging in.');
      } else {
        // User is signed up and confirmed, redirect to dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      setLoading(false);
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="flex flex-col min-h-screen">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-12">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center space-x-2 transition-colors mb-4 sm:mb-8 hover:text-white"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium text-sm sm:text-base">Back to Home</span>
              </button>
              
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-8" 
                   style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
                <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-4" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>Create Account</h1>
              <p className="text-base sm:text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Join BirthdayReminder and never miss a celebration</p>
            </div>

            {/* Signup Form */}
            <div className="backdrop-blur-sm rounded-3xl p-6 sm:p-10 border" 
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                   borderColor: 'rgba(255, 255, 255, 0.08)',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                 }}>
              <form onSubmit={handleSignup} className="space-y-4 sm:space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="rounded-xl p-3 sm:p-4 border" style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.2)' }}>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-xs sm:text-sm font-medium" style={{ color: '#FF6B6B' }}>{error}</p>
                        {error.includes('already exists') && (
                          <button
                            type="button"
                            onClick={() => router.push('/login')}
                            className="text-xs underline mt-1 hover:opacity-80 transition-opacity"
                            style={{ color: '#FF6B6B' }}
                          >
                            Go to Sign In →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {message && (
                  <div className="rounded-xl p-3 sm:p-4 border" style={{ backgroundColor: 'rgba(34, 211, 165, 0.1)', borderColor: 'rgba(34, 211, 165, 0.2)' }}>
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-xs sm:text-sm font-medium" style={{ color: '#22D3A5' }}>{message}</p>
                        <p className="text-xs mt-1" style={{ color: 'rgba(34, 211, 165, 0.7)' }}>
                          Check your spam folder if you don't see the confirmation email.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                    disabled={loading}
                    className="w-full px-3 py-3 sm:px-4 sm:py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500 text-base"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
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
                    className="w-full px-3 py-3 sm:px-4 sm:py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500 text-base"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full transition-colors ${password.length >= 6 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                    <p className="text-xs" style={{ color: password.length >= 6 ? '#22D3A5' : 'rgba(255, 255, 255, 0.5)' }}>
                      Minimum 6 characters {password.length >= 6 ? '✓' : ''}
                    </p>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
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
                    className="w-full px-3 py-3 sm:px-4 sm:py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500 text-base"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                  {confirmPassword && (
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full transition-colors ${password === confirmPassword ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <p className="text-xs" style={{ color: password === confirmPassword ? '#22D3A5' : '#FF6B6B' }}>
                        {password === confirmPassword ? 'Passwords match ✓' : 'Passwords do not match'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Terms Notice */}
                <div className="rounded-xl p-3 sm:p-4 border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    By creating an account, you agree to our terms of service and privacy policy. 
                    We'll help you never miss a birthday again! 🎉
                  </p>
                </div>

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={loading || !email || !password || !confirmPassword || password !== confirmPassword}
                  className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px]"
                  style={{ 
                    background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                      <span>Checking Email...</span>
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-5 sm:my-8 flex items-center">
                <div className="flex-1 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}></div>
                <span className="px-3 sm:px-4 text-xs sm:text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Already have an account?</span>
                <div className="flex-1 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              </div>

              {/* Login Link */}
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full border-2 transition-all duration-300 transform hover:scale-105 min-h-[48px]"
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