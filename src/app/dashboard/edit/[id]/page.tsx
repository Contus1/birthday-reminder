'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../supabaseClient';

export default function EditBirthday() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch the existing birthday on mount
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('birthdays')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Error loading birthday:', error);
        router.push('/dashboard');
      } else if (data) {
        setName(data.name);
        setDob(data.date_of_birth);
        setNotes(data.notes || '');
      }
      setLoading(false);
    })();
  }, [id, router]);

  // Handle form submit = update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('birthdays')
      .update({ name, date_of_birth: dob, notes: notes || null })
      .eq('id', id);
    if (error) {
      alert('Failed to update: ' + error.message);
    } else {
      router.push('/dashboard');
    }
  };

  // Handle delete button
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this birthday? This action cannot be undone.')) return;
    setSaving(true);
    const { error } = await supabase
      .from('birthdays')
      .delete()
      .eq('id', id);
    if (error) {
      alert('Delete failed: ' + error.message);
    } else {
      router.push('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="flex flex-col items-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500"></div>
          <p className="text-gray-600 text-lg animate-pulse">Loading birthday details...</p>
        </div>
      </div>
    );
  }

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
              Edit Birthday
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
            {name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Edit {name}'s Birthday</h1>
          <p className="text-gray-600">
            Update the details or remove this birthday from your collection.
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={saving || !name || !dob}
                className="flex-1 btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Birthday'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                disabled={saving}
                className="flex-1 btn-outline py-4 text-lg disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Danger Zone */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
              <p className="text-red-700 mb-4 text-sm">
                Once you delete this birthday, it cannot be recovered.
              </p>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Deleting...' : 'Delete Birthday'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
