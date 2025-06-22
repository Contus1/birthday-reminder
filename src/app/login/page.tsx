'use client';

import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred with Google login.');
      setGoogleLoading(false);
      console.error('Google login error:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    setLoading(false);
    
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="flex flex-col min-h-screen">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-4 sm:mb-12">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center space-x-2 transition-colors mb-3 sm:mb-8 hover:text-white"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                
                <span className="font-medium text-sm sm:text-base"> ↩ Back to Home</span>
              </button>
              
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-8" 
                   style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
                <svg className="w-6 h-6 sm:w-10 sm:h-10" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>Welcome Back</h1>
              <p className="text-sm sm:text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Sign in to your BirthdayReminder account</p>
            </div>

            {/* Login Form */}
            <div className="backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-10 border" 
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                   borderColor: 'rgba(255, 255, 255, 0.08)',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                 }}>

              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="w-full mb-4 sm:mb-6 px-3 sm:px-4 py-2.5 sm:py-4 bg-white text-gray-800 rounded-lg sm:rounded-xl font-medium sm:font-semibold transition-all duration-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px] sm:min-h-[48px]"
              >
                {googleLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-gray-600 border-t-transparent" />
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
              </button>

              {/* Divider */}
              <div className="mb-4 sm:mb-6 flex items-center">
                <div className="flex-1 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}></div>
                <span className="px-3 sm:px-4 text-xs sm:text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>oder</span>
                <div className="flex-1 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              </div>

              <form onSubmit={handleLogin} className="space-y-3 sm:space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="rounded-lg sm:rounded-xl p-3 sm:p-4 border" style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.2)' }}>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs sm:text-sm font-medium" style={{ color: '#FF6B6B' }}>{error}</p>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || googleLoading}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500 text-sm sm:text-base"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || googleLoading}
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-4 border rounded-lg sm:rounded-xl focus:ring-2 sm:focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500 text-sm sm:text-base"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading || googleLoading || !email || !password}
                  className="w-full py-3 sm:py-4 text-sm sm:text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[44px] sm:min-h-[48px] mt-8 sm:mt-0"
                  style={{ 
                    background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-4 sm:my-8 flex items-center">
                <div className="flex-1 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}></div>
                <span className="px-3 sm:px-4 text-xs sm:text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>New to BirthdayReminder?</span>
                <div className="flex-1 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              </div>

              {/* Sign Up Link */}
              <button
                onClick={() => router.push('/signup')}
                className="w-full py-3 sm:py-4 text-sm sm:text-lg font-semibold rounded-full border-2 transition-all duration-300 transform hover:scale-105 min-h-[44px] sm:min-h-[48px]"
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: 'transparent'
                }}
              >
                Create Account
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-4 sm:mt-8 text-center">
              <p className="text-xs sm:text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                🎉 Join thousands who never miss a birthday!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}