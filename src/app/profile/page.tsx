'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; content: string } | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push('/login');
        return;
      }

      setUser(user);
      setFormData({
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        email: user.email || '',
      });
      setLoading(false);
    };

    fetchUserProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
        }
      });

      if (error) throw error;

      setMessage({ type: 'success', content: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#1A1A1A] border-t-[#00C08B]"></div>
            <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'linear-gradient(135deg, rgba(0, 192, 139, 0.1) 0%, rgba(0, 176, 213, 0.1) 100%)' }}></div>
          </div>
          <p className="text-white text-xl font-medium animate-pulse" style={{ fontWeight: 500, letterSpacing: '-0.02em' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Navigation Header */}
      <nav className="backdrop-blur-xl border-b sticky top-0 z-50" style={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderBottomColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 transition-colors duration-300 hover:text-white"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
            
            <div className="text-lg font-semibold text-white" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
              Profile Settings
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl" 
               style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}>
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
            Your <span style={{ color: '#22D3A5' }}>Profile</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Form */}
        <div className="backdrop-blur-sm rounded-3xl border max-w-2xl mx-auto" 
             style={{ 
               backgroundColor: 'rgba(255, 255, 255, 0.02)', 
               borderColor: 'rgba(255, 255, 255, 0.08)',
               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
             }}>
          <div className="p-12">
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              {/* Success/Error Messages */}
              {message && (
                <div className={`rounded-xl p-4 border ${
                  message.type === 'success' 
                    ? 'bg-green-500 bg-opacity-10 border-green-500 border-opacity-20' 
                    : 'bg-red-500 bg-opacity-10 border-red-500 border-opacity-20'
                }`}>
                  <div className="flex items-center space-x-3">
                    <svg className={`w-5 h-5 flex-shrink-0 ${
                      message.type === 'success' ? 'text-green-400' : 'text-red-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {message.type === 'success' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                    <p className={`text-sm font-medium ${
                      message.type === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}>{message.content}</p>
                  </div>
                </div>
              )}

              {/* Full Name Field */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  disabled={saving}
                  className="w-full px-4 py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                />
              </div>

              {/* Email Field (Read-only) */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-4 border rounded-xl opacity-60 cursor-not-allowed text-white"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                />
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Email cannot be changed. Contact support if you need to update your email.
                </p>
              </div>

              {/* Account Info */}
              <div className="rounded-xl p-6 border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                  Account Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Member Since:</span>
                    <span className="text-white font-medium">
                      {new Date(user?.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Account Status:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22D3A5' }}></div>
                      <span className="text-white font-medium">Active</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Email Verified:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: user?.email_confirmed_at ? '#22D3A5' : '#FF6B6B' }}></div>
                      <span className="text-white font-medium">
                        {user?.email_confirmed_at ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ 
                  background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
                }}
              >
                {saving ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Saving Changes...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="backdrop-blur-sm rounded-3xl border" 
               style={{ 
                 backgroundColor: 'rgba(255, 107, 107, 0.05)', 
                 borderColor: 'rgba(255, 107, 107, 0.2)'
               }}>
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" 
                   style={{ background: 'rgba(255, 107, 107, 0.15)' }}>
                <svg className="w-8 h-8" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#FF6B6B', fontWeight: 700, letterSpacing: '-0.02em' }}>
                Danger Zone
              </h3>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255, 107, 107, 0.8)' }}>
                Need help or want to delete your account? Contact our support team.
              </p>
              <button
                onClick={() => window.open('mailto:support@birthdayreminder.com', '_blank')}
                className="px-8 py-3 text-lg font-semibold rounded-full border-2 transition-all duration-300 transform hover:scale-105"
                style={{ 
                  borderColor: 'rgba(255, 107, 107, 0.3)',
                  color: '#FF6B6B',
                  backgroundColor: 'transparent'
                }}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}