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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#1A1A1A] border-t-[#00C08B]"></div>
            <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'linear-gradient(135deg, rgba(0, 192, 139, 0.1) 0%, rgba(0, 176, 213, 0.1) 100%)' }}></div>
          </div>
          <p className="text-white text-xl font-medium animate-pulse" style={{ fontWeight: 500, letterSpacing: '-0.02em' }}>Loading your invitation...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="w-full max-w-md text-center">
          <div className="backdrop-blur-sm rounded-3xl p-12 border" 
               style={{ 
                 backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                 borderColor: 'rgba(255, 255, 255, 0.08)',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
               }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8" 
                 style={{ background: 'rgba(255, 107, 107, 0.15)' }}>
              <svg className="w-10 h-10" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-6" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Oops! Something went wrong</h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              This invitation link seems to be invalid or may have expired. 
              Please check with your friend for a new link.
            </p>
            <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
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
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="w-full max-w-md text-center">
          <div className="backdrop-blur-sm rounded-3xl p-12 border" 
               style={{ 
                 backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                 borderColor: 'rgba(255, 255, 255, 0.08)',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
               }}>
            {/* Success Icon */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8" 
                 style={{ background: 'rgba(34, 211, 165, 0.15)' }}>
              <svg className="w-12 h-12" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-white mb-6" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>Perfect! 🎉</h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Your birthday has been safely added! Your friend will now get reminded 
              so they never miss your special day.
            </p>

            {/* Celebration Elements */}
            <div className="flex justify-center space-x-3 mb-8">
              <span className="text-3xl animate-bounce">🎂</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎈</span>
              <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</span>
            </div>

            {/* Next Steps */}
            <div className="rounded-2xl p-6 border mb-8" style={{ backgroundColor: 'rgba(34, 211, 165, 0.1)', borderColor: 'rgba(34, 211, 165, 0.2)' }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: '#22D3A5', fontWeight: 700, letterSpacing: '-0.01em' }}>What happens next?</h3>
              <div className="space-y-3 text-base" style={{ color: 'rgba(34, 211, 165, 0.9)' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22D3A5' }}></div>
                  <span>Your friend gets notified about your birthday</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22D3A5' }}></div>
                  <span>They'll receive reminders before your special day</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22D3A5' }}></div>
                  <span>No more forgotten birthdays!</span>
                </div>
              </div>
            </div>

            {/* Subtle CTA */}
            <div className="pt-6 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.08)' }}>
              <p className="text-sm mb-4" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Want to organize your own birthday reminders?
              </p>
              <a
                href="/"
                className="inline-flex items-center space-x-2 font-medium transition-colors hover:text-white text-lg"
                style={{ color: '#22D3A5' }}
              >
                <span>Check out BirthdayReminder</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8" 
               style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
            <svg className="w-10 h-10" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v1m6-1v1m-6 0h6M6 7H3a1 1 0 00-1 1v11a1 1 0 001 1h18a1 1 0 001-1V8a1 1 0 00-1-1h-3" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-6" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>You're Invited! 🎉</h1>
          <p className="text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Your friend wants to make sure they never miss your birthday! 
            Just add your details below and you're all set.
          </p>
        </div>

        {/* Form */}
        <div className="backdrop-blur-sm rounded-3xl p-10 border" 
             style={{ 
               backgroundColor: 'rgba(255, 255, 255, 0.02)', 
               borderColor: 'rgba(255, 255, 255, 0.08)',
               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
             }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                Your Name *
              </label>
              <input
                required
                type="text"
                placeholder="What should we call you?"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all text-white placeholder-gray-500"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </div>

            {/* Date Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                Your Birthday *
              </label>
              <input
                required
                type="date"
                value={form.date_of_birth}
                onChange={(e) => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
                className="w-full px-4 py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all text-white"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </div>

            {/* Notes Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white" style={{ color: 'rgba(255, 255, 255, 0.9)', letterSpacing: '-0.01em' }}>
                Special Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Any gift ideas, favorite treats, or special notes for your friend..."
                value={form.notes}
                onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                className="w-full px-4 py-4 border rounded-xl focus:ring-4 focus:outline-none transition-all resize-none text-white placeholder-gray-500"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              />
            </div>

            {/* Privacy Notice */}
            <div className="rounded-2xl p-4 border" style={{ backgroundColor: 'rgba(34, 211, 165, 0.1)', borderColor: 'rgba(34, 211, 165, 0.2)' }}>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#22D3A5' }}>Your Privacy Matters</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(34, 211, 165, 0.8)' }}>
                    Your information is only shared with the friend who invited you and will be used solely for birthday reminders.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!form.name || !form.date_of_birth}
              className="w-full py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{ 
                background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                color: '#FFFFFF',
                boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
              }}
            >
              Add My Birthday 🎂
            </button>
          </form>
        </div>

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            🎈 Your friend cares about celebrating you! They'll get gentle reminders so your special day is never forgotten.
          </p>
        </div>
      </div>
    </div>
  );
}
