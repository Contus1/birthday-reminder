'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';
import { customAlphabet } from 'nanoid';
import ExportSuccessPopup from '../components/ExportSuccessPopup';
import ProfileDropdown from '../components/ProfileDropdown';

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
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // invite UI
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // export success popup
  const [showExportSuccess, setShowExportSuccess] = useState(false);

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

      setUserEmail(session.user.email || null);
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

    // 4) show success popup
    setShowExportSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="flex flex-col items-center space-y-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-[#1A1A1A] border-t-[#00C08B]"></div>
            <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'linear-gradient(135deg, rgba(0, 192, 139, 0.1) 0%, rgba(0, 176, 213, 0.1) 100%)' }}></div>
          </div>
          <p className="text-white text-xl font-medium animate-pulse" style={{ fontWeight: 500, letterSpacing: '-0.02em' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>

        {/* Navigation Header */}
        <nav className="backdrop-blur-xl border-b sticky top-0 z-50" style={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderBottomColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}>
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                    Birthday<span style={{ color: '#22D3A5' }}>Reminder</span>
                  </h1>
                </div>
                <div className="hidden md:flex">
                  <span className="text-sm font-medium px-4 py-2 rounded-full border" style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                    Dashboard
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="transition-all duration-300 flex items-center space-x-2 hover:text-white"
                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="hidden md:inline font-medium">Back to Home</span>
                </button>
                <ProfileDropdown userEmail={userEmail} />
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-8 py-20">
          
          {/* Action Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-24">
            {/* Generate Invite Link Card */}
            <div className="backdrop-blur-sm rounded-3xl p-12 border transition-all duration-500 group hover:scale-105" 
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                   borderColor: 'rgba(255, 255, 255, 0.08)',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300" 
                   style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
                <svg className="w-8 h-8" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Share Invite Link</h3>
              <p className="mb-8 leading-relaxed text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Generate a secure link for friends to add their birthdays</p>
              <button
                onClick={createInvite}
                className="w-full font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                style={{ 
                  background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
                }}
              >
                Generate Secure Link
              </button>
              
              {inviteLink && (
                <div className="mt-8 p-6 rounded-2xl border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <p className="text-sm mb-4 font-medium text-white" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Share this link with friends:</p>
                  <div className="flex items-stretch space-x-3">
                    <input 
                      type="text" 
                      value={inviteLink} 
                      readOnly 
                      className="flex-1 text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '12px',
                        minHeight: '36px'
                      }}
                    />
                    <button
                      onClick={() => copyToClipboard(inviteLink)}
                      className="px-3 py-2 text-white rounded-lg text-xs font-medium transition-all duration-200 flex-shrink-0"
                      style={{ 
                        background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                        minWidth: '60px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {copied ? '✓ Done' : 'Copy'}
                    </button>
                  </div>

                  <div className="mt-6 p-4 rounded-xl border" style={{ backgroundColor: 'rgba(34, 211, 165, 0.1)', borderColor: 'rgba(34, 211, 165, 0.2)' }}>
                    <p className="text-sm leading-relaxed" style={{ color: '#22D3A5' }}>
                      💡 <strong>Pro tip:</strong> Share this in your group chat, let everyone add their birthdays, 
                      then export and share the calendar back to keep everyone connected! 🎉
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Add Birthday Card */}
            <div className="backdrop-blur-sm rounded-3xl p-12 border transition-all duration-500 group hover:scale-105" 
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                   borderColor: 'rgba(255, 255, 255, 0.08)',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300" 
                   style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
                <svg className="w-8 h-8" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Add Birthday</h3>
              <p className="mb-8 leading-relaxed text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Manually add a birthday to your personal collection</p>
              <button
                onClick={() => router.push('/dashboard/add')}
                className="w-full font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 border"
                style={{ 
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                }}
              >
                Add New Birthday
              </button>
            </div>

            {/* Export Calendar Card */}
            <div className="backdrop-blur-sm rounded-3xl p-12 border transition-all duration-500 group hover:scale-105" 
                 style={{ 
                   backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                   borderColor: 'rgba(255, 255, 255, 0.08)',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                 }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300" 
                   style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
                <svg className="w-8 h-8" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Export Calendar</h3>
              <p className="mb-8 leading-relaxed text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Download .ics file and receive automated email reminders</p>
              <button
                onClick={exportAndEmail}
                className="w-full border-2 font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  backgroundColor: 'transparent'
                }}
              >
                Export & Email
              </button>
            </div>
          </div>

          {/* Birthdays List */}
          <div className="backdrop-blur-sm rounded-3xl border overflow-hidden" 
               style={{ 
                 backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                 borderColor: 'rgba(255, 255, 255, 0.08)',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
               }}>
            <div className="px-12 py-8 border-b" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderBottomColor: 'rgba(255, 255, 255, 0.08)' }}>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <h3 className="text-3xl font-bold text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                    Birthday Collection
                  </h3>
                  <span className="px-4 py-2 rounded-full text-sm font-medium border" 
                        style={{ 
                          background: 'rgba(0, 192, 139, 0.15)', 
                          color: '#22D3A5',
                          borderColor: 'rgba(0, 192, 139, 0.3)'
                        }}>
                    {birthdays.length} contacts
                  </span>
                </div>
                <button
                  onClick={() => router.push('/dashboard/exported')}
                  className="font-medium transition-colors duration-200 flex items-center space-x-2 hover:text-white"
                  style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <span>View Exported</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>

            {birthdays.length === 0 ? (
              <div className="px-12 py-24 text-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8" 
                     style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <svg className="w-12 h-12" style={{ color: 'rgba(255, 255, 255, 0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v1m6-1v1m-6 0h6M6 7H3a1 1 0 00-1 1v11a1 1 0 001 1h18a1 1 0 001-1V8a1 1 0 00-1-1h-3" />
                  </svg>
                </div>
                <h4 className="text-3xl font-bold mb-6 text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>No birthdays yet</h4>
                <p className="mb-12 max-w-lg mx-auto text-xl leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Start building your birthday collection by adding contacts manually or sharing your invite link with friends.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button
                    onClick={() => router.push('/dashboard/add')}
                    className="font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
                    style={{ 
                      background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                      color: '#FFFFFF',
                      boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
                    }}
                  >
                    Add First Birthday
                  </button>
                  
                </div>
              </div>
            ) : (
              <div>
                {birthdays.map((birthday) => (
                  <div
                    key={birthday.id}
                    className="px-12 py-8 transition-all duration-300 group border-b last:border-b-0 hover:bg-white hover:bg-opacity-[0.02]"
                    style={{ 
                      borderBottomColor: 'rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex items-center space-x-6">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg" 
                             style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}>
                          {birthday.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white mb-1" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                            {birthday.name}
                          </h4>
                          <p className="text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {new Date(birthday.date_of_birth).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          {birthday.notes && (
                            <p className="mt-2 italic" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              "{birthday.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => router.push(`/dashboard/edit/${birthday.id}`)}
                          className="p-3 rounded-xl transition-all duration-200 border border-transparent hover:bg-white hover:bg-opacity-5 hover:border-white hover:border-opacity-20"
                          style={{ 
                            color: 'rgba(255, 255, 255, 0.5)'
                          }}
                          title="Edit"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#22D3A5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                          }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteBirthday(birthday.id)}
                          className="p-3 rounded-xl transition-all duration-200 border border-transparent hover:bg-white hover:bg-opacity-5 hover:border-white hover:border-opacity-20"
                          style={{ 
                            color: 'rgba(255, 255, 255, 0.5)'
                          }}
                          title="Delete"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#FF6B6B';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                          }}
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

        {/* Footer */}
        <footer className="backdrop-blur-sm border-t mt-32" style={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderTopColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="max-w-7xl mx-auto px-8 py-16">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}>
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="text-2xl font-bold text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Birthday<span style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reminder</span>
                </div>
              </div>
              <p className="text-lg mb-2 text-white" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                © 2025 BirthdayReminder. Never miss a birthday again.
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                Crafted with love in Madrid by <span style={{ color: '#22D3A5' }}>Carl Lichtl</span>
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Export Success Popup */}
      <ExportSuccessPopup 
        isOpen={showExportSuccess} 
        onClose={() => setShowExportSuccess(false)} 
      />
    </>
  );
}
