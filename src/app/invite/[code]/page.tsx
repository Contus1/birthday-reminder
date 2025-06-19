'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../supabaseClient';

export default function InvitePage() {
  const { code } = useParams<{ code: string }>();
  const [ownerId, setOwnerId] = useState<string|null>(null);
  const [form, setForm] = useState({ name: '', date_of_birth: '', notes: '' });
  const [status, setStatus] = useState<'loading'|'ready'|'sent'|'error'>('loading');

  useEffect(() => {
    // look up the invite → find the owner
    supabase
      .from('invites')
      .select('user_id')
      .eq('invite_code', code)
      .single()
      .then(({ data, error }: { data: { user_id: string } | null; error: any }) => {
        if (error || !data) return setStatus('error');
        setOwnerId(data.user_id);
        setStatus('ready');
      });
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const payload = {
      code,
      name: form.name,
      date_of_birth: form.date_of_birth,
      notes: form.notes,
    };

    const res = await fetch('/api/invite/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      console.error('Invite submit error:', json.error);
      setStatus('error');
    } else {
      setStatus('sent');
    }
  };

  // Loading State
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-gray-50 flex items-center justify-center px-6">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 left-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 right-20 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg animate-pulse">Loading your invitation...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-gray-50 flex items-center justify-center px-6">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 right-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 left-10 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        <div className="w-full max-w-md text-center relative z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              This invitation link seems to be invalid or may have expired. 
              Please check with your friend for a new link.
            </p>
            <div className="text-sm text-gray-500">
              If you keep having issues, your friend can generate a new invitation link for you.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (status === 'sent') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-gray-50 flex items-center justify-center px-6">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-3000"></div>
        </div>

        <div className="w-full max-w-md text-center relative z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">Perfect! 🎉</h1>
            <p className="text-gray-600 mb-8 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              Your birthday has been safely added! Your friend will now get reminded 
              so they never miss your special day.
            </p>

            {/* Celebration Elements */}
            <div className="flex justify-center space-x-2 mb-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <span className="text-2xl animate-bounce">🎂</span>
              <span className="text-2xl animate-bounce animation-delay-1000">🎈</span>
              <span className="text-2xl animate-bounce animation-delay-2000">🎊</span>
            </div>

            {/* Next Steps */}
            <div className="bg-pink-50 rounded-2xl p-6 border border-pink-100 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens next?</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>Your friend gets notified about your birthday</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>They'll receive reminders before your special day</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>No more forgotten birthdays!</span>
                </div>
              </div>
            </div>

            {/* Subtle CTA */}
            <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <p className="text-sm text-gray-500 mb-4">
                Want to organize your own birthday reminders?
              </p>
              <a
                href="/"
                className="inline-flex items-center space-x-2 text-pink-500 hover:text-pink-600 font-medium transition-colors text-sm"
              >
                <span>Check out BirthdayReminder</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form State - Main invite form
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-gray-50 flex items-center justify-center px-6">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 left-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-3000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v1m6-1v1m-6 0h6M6 7H3a1 1 0 00-1 1v11a1 1 0 001 1h18a1 1 0 001-1V8a1 1 0 00-1-1h-3" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3 animate-fade-in-up">You're Invited! 🎉</h1>
          <p className="text-gray-600 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            Your friend wants to make sure they never miss your birthday! 
            Just add your details below and you're all set.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 p-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Your Name *
              </label>
              <input
                required
                type="text"
                placeholder="What should we call you?"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all bg-white/70 backdrop-blur-sm"
              />
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Your Birthday *
              </label>
              <input
                required
                type="date"
                value={form.date_of_birth}
                onChange={(e) => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all bg-white/70 backdrop-blur-sm"
              />
            </div>

            {/* Notes Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Special Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Any gift ideas, favorite treats, or special notes for your friend..."
                value={form.notes}
                onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all resize-none bg-white/70 backdrop-blur-sm"
              />
            </div>

            {/* Privacy Notice */}
            <div className="bg-pink-50/80 backdrop-blur-sm rounded-2xl p-4 border border-pink-100">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-pink-900 mb-1">Your Privacy Matters</p>
                  <p className="text-xs text-pink-700 leading-relaxed">
                    Your information is only shared with the friend who invited you and will be used solely for birthday reminders.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!form.name || !form.date_of_birth}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Add My Birthday 🎂
            </button>
          </form>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <p className="text-sm text-gray-500 leading-relaxed">
            🎈 Your friend cares about celebrating you! They'll get gentle reminders so your special day is never forgotten.
          </p>
        </div>
      </div>
    </div>
  );
}
