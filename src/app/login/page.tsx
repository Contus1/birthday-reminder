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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-4" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>Welcome Back</h1>
              <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Sign in to your BirthdayReminder account</p>
            </div>

            {/* Login Form */}
            <div className="backdrop-blur-sm rounded-3xl p-10 border" 
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                   borderColor: 'rgba(255, 255, 255, 0.08)',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                 }}>
              <form onSubmit={handleLogin} className="space-y-6">
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
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  />
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading || !email || !password}
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
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}></div>
                <span className="px-4 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>New to BirthdayReminder?</span>
                <div className="flex-1 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.1)' }}></div>
              </div>

              {/* Sign Up Link */}
              <button
                onClick={() => router.push('/signup')}
                className="w-full py-4 text-lg font-semibold rounded-full border-2 transition-all duration-300 transform hover:scale-105"
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
            <div className="mt-8 text-center">
              <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                🎉 Join thousands who never miss a birthday!
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}