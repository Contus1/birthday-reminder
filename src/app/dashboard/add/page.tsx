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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
            </div>
            
            <div className="text-lg font-semibold text-gray-900">
              Add Birthday
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Add New Birthday</h1>
          <p className="text-gray-600">
            Add a friend's birthday to your collection and never miss their special day.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Full Name *
              </label>
              <input
                required
                type="text"
                placeholder="Enter friend's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Date of Birth *
              </label>
              <input
                required
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Notes Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Add any special notes or gift ideas..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || !name || !dob}
                className="flex-1 btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="flex-1 btn-outline py-4 text-lg disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 Tip: You can also share your invite link to let friends add their own birthdays!
          </p>
        </div>
      </main>
    </div>
  );
}
