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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#1A1A1A] border-t-[#00C08B]"></div>
            <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'linear-gradient(135deg, rgba(0, 192, 139, 0.1) 0%, rgba(0, 176, 213, 0.1) 100%)' }}></div>
          </div>
          <p className="text-white text-xl font-medium animate-pulse" style={{ fontWeight: 500, letterSpacing: '-0.02em' }}>Loading birthday details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Navigation Header */}
      <nav className="backdrop-blur-xl border-b sticky top-0 z-50" style={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderBottomColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 transition-colors duration-300 hover:text-white"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium text-sm sm:text-base">Back to Dashboard</span>
              </button>
            </div>
            
            <div className="text-base sm:text-lg font-semibold text-white" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
              Edit Birthday
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 text-white font-bold text-xl sm:text-2xl shadow-lg" 
               style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
            Edit <span style={{ color: '#22D3A5' }}>{name}</span>'s Birthday
          </h1>
          <p className="text-base sm:text-xl leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Update the details or remove this birthday from your collection.
          </p>
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-sm rounded-3xl border p-6 sm:p-12" 
             style={{ 
               backgroundColor: 'rgba(255, 255, 255, 0.02)', 
               borderColor: 'rgba(255, 255, 255, 0.08)',
               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
             }}>
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Name Field */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                Full Name *
              </label>
              <input
                required
                type="text"
                placeholder="Enter friend's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
                className="w-full px-3 py-3 sm:px-4 sm:py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500 text-base"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </div>

            {/* Date Field */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                Date of Birth *
              </label>
              <input
                required
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={saving}
                className="w-full px-3 py-3 sm:px-4 sm:py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white text-base"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </div>

            {/* Notes Field */}
            <div className="space-y-2 sm:space-y-3">
              <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Add any special notes or gift ideas..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={saving}
                className="w-full px-3 py-3 sm:px-4 sm:py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none text-white placeholder-gray-500 text-base"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 sm:pt-8">
              <button
                type="submit"
                disabled={saving || !name || !dob}
                className="flex-1 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px]"
                style={{ 
                  background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
                }}
              >
                {saving ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
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
                className="flex-1 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full border-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 min-h-[48px]"
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

          {/* Danger Zone */}
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.08)' }}>
            <div className="rounded-2xl p-6 sm:p-8 border" style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', borderColor: 'rgba(255, 107, 107, 0.2)' }}>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4" style={{ color: '#FF6B6B', fontWeight: 700, letterSpacing: '-0.02em' }}>Danger Zone</h3>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(255, 107, 107, 0.8)' }}>
                Once you delete this birthday, it cannot be recovered.
              </p>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[48px]"
                style={{ 
                  backgroundColor: '#FF6B6B',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 32px rgba(255, 107, 107, 0.3)'
                }}
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
