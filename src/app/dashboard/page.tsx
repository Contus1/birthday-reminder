'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';
import { customAlphabet } from 'nanoid';

// 8-char alphanumeric ID
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

type Birthday = {
  id: string;
  user_id: string;
  name: string;
  date_of_birth: string;
  notes: string | null;
};

export default function Dashboard() {
  const router = useRouter();

  // birthdays list
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);

  // invite UI
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // logout handler
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
    else router.push('/login');
  };

  // copy invite link to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // generate & save an invite_code
  const createInvite = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      router.push('/login');
      return;
    }

    const code = nanoid();
    const { error } = await supabase
      .from('invites')
      .insert({ user_id: session.user.id, invite_code: code });

    if (error) {
      console.error('Invite creation error:', error);
      return;
    }

    setInviteLink(`${window.location.origin}/invite/${code}`);
  };

  // fetch your birthdays
  useEffect(() => {
    (async () => {
      const {
        data: { session },
        error: sessErr,
      } = await supabase.auth.getSession();
      if (sessErr || !session) {
        router.push('/login');
        return;
      }

      const userId = session.user.id;
      const { data, error } = await supabase
        .from('birthdays')
        .select('*')
        .eq('user_id', userId)
        .order('date_of_birth');

      if (error) console.error('Fetch birthdays error:', error);
      else setBirthdays(data || []);
      setLoading(false);
    })();
  }, [router]);

  // delete a single birthday
  const deleteBirthday = async (id: string) => {
    if (!confirm('Are you sure you want to delete this birthday?')) return;
    const { error } = await supabase
      .from('birthdays')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      setBirthdays(prev => prev.filter(b => b.id !== id));
    }
  };

  // export & email the .ics, then download it
  const exportAndEmail = async () => {
    // 1) get session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session) return router.push('/login');

    // 2) call API
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session.user.id,
        userEmail: session.user.email,
      }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      alert('Export failed: ' + (error || res.statusText));
      return;
    }

    // 3) download the returned file
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'birthdays.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="flex flex-col items-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500"></div>
          <p className="text-gray-600 text-lg animate-pulse">Loading your birthdays...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Birthday<span className="text-pink-500">Reminder</span>
              </h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Dashboard
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Home
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Birthday <span className="gradient-text">Collection</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your friends' birthdays, share invite links, and never miss a celebration again.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Generate Invite Link Card */}
          <div className="feature-card">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Share Invite Link</h3>
            <p className="text-gray-600 mb-6">Generate a link for friends to add their birthdays</p>
            <button
              onClick={createInvite}
              className="btn-primary w-full"
            >
              Generate Link
            </button>
            
            {inviteLink && (
              <div className="mt-6 p-4 bg-pink-50 rounded-xl border border-pink-100">
                <p className="text-sm text-gray-700 mb-2 font-medium">Share this link:</p>
                <div className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    value={inviteLink} 
                    readOnly 
                    className="flex-1 text-sm bg-white border border-pink-200 rounded-lg px-3 py-2"
                  />
                  <button
                    onClick={() => copyToClipboard(inviteLink)}
                    className="px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm transition-colors"
                  >
                    {copied ? '✓' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add Birthday Card */}
          <div className="feature-card">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Add Birthday</h3>
            <p className="text-gray-600 mb-6">Manually add a birthday to your collection</p>
            <button
              onClick={() => router.push('/dashboard/add')}
              className="btn-secondary w-full"
            >
              Add Birthday
            </button>
          </div>

          {/* Export Calendar Card */}
          <div className="feature-card">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Export Calendar</h3>
            <p className="text-gray-600 mb-6">Download .ics file and get email reminders</p>
            <button
              onClick={exportAndEmail}
              className="btn-outline w-full"
            >
              Export & Email
            </button>
          </div>
        </div>

        {/* Birthdays List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                Birthdays ({birthdays.length})
              </h3>
              <button
                onClick={() => router.push('/dashboard/exported')}
                className="text-gray-600 hover:text-pink-500 text-sm font-medium transition-colors"
              >
                View Exported →
              </button>
            </div>
          </div>

          {birthdays.length === 0 ? (
            <div className="px-8 py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v1m6-1v1m-6 0h6M6 7H3a1 1 0 00-1 1v11a1 1 0 001 1h18a1 1 0 001-1V8a1 1 0 00-1-1h-3" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">No birthdays yet</h4>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                Start by adding birthdays manually or sharing your invite link with friends.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/dashboard/add')}
                  className="btn-primary"
                >
                  Add First Birthday
                </button>
                <button
                  onClick={createInvite}
                  className="btn-outline"
                >
                  Generate Invite Link
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {birthdays.map((birthday, index) => (
                <div
                  key={birthday.id}
                  className="px-8 py-6 hover:bg-gray-50/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {birthday.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {birthday.name}
                          </h4>
                          <p className="text-gray-600">
                            {new Date(birthday.date_of_birth).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          {birthday.notes && (
                            <p className="text-sm text-gray-500 mt-1 italic">
                              "{birthday.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => router.push(`/dashboard/edit/${birthday.id}`)}
                        className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteBirthday(birthday.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer - Now outside main for proper layout */}
      <footer className="bg-gray-900 text-white border-t border-gray-800 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">
              Birthday<span className="text-pink-500">Reminder</span>
            </div>
            <p className="text-gray-400">
              © 2025 BirthdayReminder. Never miss a birthday again.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Created by Carl Lichtl
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
