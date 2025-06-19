// src/app/dashboard/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';

export default function AddBirthday() {
  const router = useRouter();

  // form state
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [notes, setNotes] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1) get the logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Auth error:', userError);
      alert('Auth failure, please log in again.');
      router.push('/login');
      return;
    }
    if (!user) {
      router.push('/login');
      return;
    }

    // 2) try inserting the row
    const { data, error } = await supabase
      .from('birthdays')
      .insert([
        {
          user_id: user.id,
          name,
          date_of_birth: dob,
          notes: notes || null,
        },
      ]);

    // 3) log the result so we can debug
    console.log('Insert result:', { data, error });

    if (error) {
      alert('Failed to save birthday: ' + error.message);
      setLoading(false);
      return;
    }

    // 4) on success, go back to the dashboard
    router.push('/dashboard');
  };

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
              Add Birthday
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8" 
               style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
            <svg className="w-10 h-10" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
            Add New <span style={{ color: '#22D3A5' }}>Birthday</span>
          </h1>
          <p className="text-xl leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Add a friend's birthday to your collection and never miss their special day.
          </p>
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-sm rounded-3xl border p-12" 
             style={{ 
               backgroundColor: 'rgba(255, 255, 255, 0.02)', 
               borderColor: 'rgba(255, 255, 255, 0.08)',
               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
             }}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                Full Name *
              </label>
              <input
                required
                type="text"
                placeholder="Enter friend's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </div>

            {/* Date Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                Date of Birth *
              </label>
              <input
                required
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </div>

            {/* Notes Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                Notes (Optional)
              </label>
              <textarea
                rows={4}
                placeholder="Add any special notes or gift ideas..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none text-white placeholder-gray-500"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <button
                type="submit"
                disabled={loading || !name || !dob}
                className="flex-1 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ 
                  background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Birthday'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                disabled={loading}
                className="flex-1 py-4 text-lg font-semibold rounded-full border-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: 'transparent'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-12 text-center">
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'rgba(34, 211, 165, 0.1)', borderColor: 'rgba(34, 211, 165, 0.2)' }}>
            <p className="text-sm leading-relaxed" style={{ color: '#22D3A5' }}>
              💡 <strong>Pro tip:</strong> You can also share your invite link to let friends add their own birthdays!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
