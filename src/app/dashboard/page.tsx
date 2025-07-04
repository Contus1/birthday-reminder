'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../supabaseClient';
import { customAlphabet } from 'nanoid';
import ProfileDropdown from '../components/ProfileDropdown';
import ExportSuccessPopup from '../components/ExportSuccessPopup';
import AutoSyncSuccessPopup from '../components/AutoSyncSuccessPopup';
import QuickStartGuide from '../components/QuickStartGuide';

// 8-char alphanumeric ID
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

type Birthday = {
  id: string;
  user_id: string;
  name: string;
  date_of_birth: string;
  notes: string | null;
};

type SyncStatus = {
  calendar_sync_enabled: boolean;
  first_sync_date: string | null;
  last_sync_date: string | null;
};

export default function Dashboard() {
  const router = useRouter();
  const inviteLinkRef = useRef<HTMLDivElement>(null);

  // birthdays list
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // invite UI
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // sync status
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);

  // export success popup
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  // auto-sync success popup
  const [showAutoSyncSuccess, setShowAutoSyncSuccess] = useState(false);

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
      console.error('Failed to copy: ', err);
    }
  };

  // update sync status in database
  const updateSyncStatus = async (enabled: boolean) => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) return;

    const now = new Date().toISOString();
    
    // First try to update existing record
    const { error: updateError } = await supabase
      .from('user_sync_status')
      .update({ 
        calendar_sync_enabled: enabled,
        last_sync_date: now,
        first_sync_date: syncStatus?.first_sync_date || now,
        updated_at: now
      })
      .eq('user_id', session.user.id);

    // If update failed (no existing record), insert new one
    if (updateError) {
      const { error: insertError } = await supabase
        .from('user_sync_status')
        .insert({
          user_id: session.user.id,
          calendar_sync_enabled: enabled,
          first_sync_date: now,
          last_sync_date: now
        });

      if (insertError) {
        console.error('Error inserting sync status:', insertError);
        return;
      }
    }

    // Update local state
    setSyncStatus({
      calendar_sync_enabled: enabled,
      first_sync_date: syncStatus?.first_sync_date || now,
      last_sync_date: now
    });
  };

  // fetch sync status
  const fetchSyncStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_sync_status')
      .select('calendar_sync_enabled, first_sync_date, last_sync_date')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching sync status:', error);
    } else if (data) {
      setSyncStatus(data);
    }
  };

  // generate & save an invite_code (or get existing one)
  const createInvite = async (showLinkSection = true) => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      router.push('/login');
      return;
    }

    // First check if user already has an invite code
    const { data: existingInvite } = await supabase
      .from('invites')
      .select('invite_code')
      .eq('user_id', session.user.id)
      .single();

    let code: string;
    
    if (existingInvite) {
      // Use existing invite code
      code = existingInvite.invite_code;
    } else {
      // Create new invite code
      code = nanoid();
      const { error } = await supabase
        .from('invites')
        .insert({ user_id: session.user.id, invite_code: code });

      if (error) {
        console.error('Error creating invite:', error);
        return;
      }
    }

    setInviteCode(code);
    
    // Only set invite link and show section if explicitly requested
    if (showLinkSection) {
      const linkUrl = `${window.location.origin}/invite/${code}`;
      setInviteLink(linkUrl);
      
      setTimeout(() => {
        inviteLinkRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  };

  // fetch your birthdays and existing invite codes
  useEffect(() => {
    (async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        router.push('/login');
        return;
      }

      setUserEmail(session.user.email || null);

      // Fetch birthdays
      const { data, error } = await supabase
        .from('birthdays')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date_of_birth', { ascending: true });

      if (error) {
        console.error('Error fetching birthdays:', error);
      } else {
        setBirthdays(data || []);
      }

      // Fetch sync status
      await fetchSyncStatus(session.user.id);

      // Auto-load existing invite code if user has birthdays (silent mode)
      if (data && data.length > 0) {
        await createInvite(false);
      }

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
      console.error('Delete error:', error);
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
    if (sessionError || !session) return;

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
      console.error('Export failed');
      return;
    }

    // 3) download the returned file
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'birthdays.ics';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    
    // Show the popup instead of inline success message
    setShowExportSuccess(true);
  };

  // open calendar subscription
  const openCalendarSubscription = async () => {
    // If no invite code exists, create one silently
    if (!inviteCode) {
      await createInvite(false);
      // Wait a moment for state to update, then use the newly created code
      setTimeout(() => {
        if (inviteCode) {
          const subscriptionUrl = `webcal://${window.location.host}/api/calendar?token=${inviteCode}`;
          window.location.href = subscriptionUrl;
          // Update sync status and show success popup
          updateSyncStatus(true);
          setShowAutoSyncSuccess(true);
        }
      }, 500);
      return;
    }
    
    const subscriptionUrl = `webcal://${window.location.host}/api/calendar?token=${inviteCode}`;
    window.location.href = subscriptionUrl;
    // Update sync status and show success popup
    await updateSyncStatus(true);
    setShowAutoSyncSuccess(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-[#1A1A1A] border-t-[#00C08B]"></div>
            <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'linear-gradient(135deg, rgba(0, 192, 139, 0.1) 0%, rgba(0, 176, 213, 0.1) 100%)' }}></div>
          </div>
          <p className="text-white text-lg sm:text-xl font-medium animate-pulse" style={{ fontWeight: 500, letterSpacing: '-0.02em' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Navigation Header */}
      <nav className="backdrop-blur-xl border-b sticky top-0 z-50" style={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderBottomColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}>
                <svg className="w-3 h-3 sm:w-5 sm:h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                Birthday<span style={{ color: '#22D3A5' }}>Reminder</span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ProfileDropdown userEmail={userEmail} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-12 md:py-16">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
            Your <span style={{ color: '#22D3A5' }}>Dashboard</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto mb-4 sm:mb-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Manage birthdays, create invite links, and never miss a celebration
          </p>
          
          {/* Quick Start Guide - smaller and centered */}
          <div className="flex justify-center">
            <div className="inline-block">
              <QuickStartGuide variant="dashboard" />
            </div>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatus?.calendar_sync_enabled && (
          <div className="mb-8 sm:mb-12 md:mb-16">
            <div className="backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border" 
                 style={{ 
                   backgroundColor: 'rgba(34, 211, 165, 0.1)', 
                   borderColor: 'rgba(34, 211, 165, 0.2)'
                 }}>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0" 
                     style={{ backgroundColor: '#22D3A5' }}>
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: '#22D3A5', fontWeight: 700, letterSpacing: '-0.01em' }}>
                    ✅ Calendar Auto-Sync Enabled
                  </h3>
                  <p className="text-sm sm:text-base mb-1" style={{ color: 'rgba(34, 211, 165, 0.8)' }}>
                    Your calendar is automatically syncing with your birthdays.
                  </p>
                  {syncStatus.first_sync_date && (
                    <p className="text-xs sm:text-sm" style={{ color: 'rgba(34, 211, 165, 0.6)' }}>
                      First synced: {new Date(syncStatus.first_sync_date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16">
          {/* Add Birthday */}
          <button
            onClick={() => router.push('/dashboard/add')}
            className="backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border transition-all duration-300 hover:scale-105 text-center group"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.02)', 
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" 
                 style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
              <svg className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Add Birthday</h3>
            <p className="text-sm sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Manually add a birthday
            </p>
          </button>

          {/* Create Invite */}
          <button
            onClick={() => createInvite(true)}
            className="backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border transition-all duration-300 hover:scale-105 text-center group"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.02)', 
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" 
                 style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
              <svg className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Create Invite</h3>
            <p className="text-sm sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Share link with friends
            </p>
          </button>

          {/* Export Calendar */}
          <button
            onClick={exportAndEmail}
            disabled={birthdays.length === 0}
            className="backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border transition-all duration-300 hover:scale-105 text-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.02)', 
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" 
                 style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
              <svg className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Export to Calendar</h3>
            <p className="text-sm sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Add events to my calendar
            </p>
          </button>

          {/* Auto-Sync Calendar */}
          <button
            onClick={openCalendarSubscription}
            disabled={birthdays.length === 0}
            className="backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border transition-all duration-300 hover:scale-105 text-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.02)', 
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            {syncStatus?.calendar_sync_enabled && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: '#22D3A5' }}>
                <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" 
                 style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
              <svg className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Auto-Sync Calendar</h3>
            <p className="text-sm sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {syncStatus?.calendar_sync_enabled ? 'Already syncing' : 'Updates automatically'}
            </p>
          </button>

          {/* View Exported */}
          <button
            onClick={() => router.push('/dashboard/exported')}
            className="backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border transition-all duration-300 hover:scale-105 text-center group"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.02)', 
              borderColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" 
                 style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
              <svg className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>History</h3>
            <p className="text-sm sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              View past exports
            </p>
          </button>
        </div>

        {/* Invite Link Display */}
        {inviteLink && (
          <div ref={inviteLinkRef} className="mb-8 sm:mb-12 md:mb-16">
            <div className="backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border" 
                 style={{ 
                   backgroundColor: 'rgba(34, 211, 165, 0.1)', 
                   borderColor: 'rgba(34, 211, 165, 0.2)'
                 }}>
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: '#22D3A5', fontWeight: 700, letterSpacing: '-0.01em' }}>
                🎉 Invite Link Created!
              </h3>
              <p className="text-sm sm:text-base mb-4 sm:mb-6" style={{ color: 'rgba(34, 211, 165, 0.8)' }}>
                Share this link with friends and family so they can add their birthdays:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 px-3 py-3 sm:px-4 sm:py-4 rounded-xl border text-sm sm:text-base font-mono break-all" 
                     style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(34, 211, 165, 0.3)', color: '#22D3A5' }}>
                  {inviteLink}
                </div>
                <button
                  onClick={() => copyToClipboard(inviteLink)}
                  className="px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base min-h-[48px]"
                  style={{ 
                    background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
                  }}
                >
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>

              {/* Pro Tip Section */}
              <div className="rounded-xl p-4 sm:p-6 border" 
                   style={{ 
                     backgroundColor: 'rgba(34, 211, 165, 0.15)', 
                     borderColor: 'rgba(34, 211, 165, 0.3)'
                   }}>
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0" 
                       style={{ backgroundColor: '#22D3A5' }}>
                    <span className="text-base sm:text-lg">💡</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-bold mb-2 sm:mb-3" style={{ color: '#22D3A5', fontWeight: 700, letterSpacing: '-0.01em' }}>
                      Pro tip:
                    </h4>
                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(34, 211, 165, 0.9)' }}>
                      Share this in your group chat, let everyone add their birthdays, then use "Export to Calendar" or "Auto-Sync Calendar" 
                      to get the calendar and keep everyone connected! 
                      <span className="inline-block ml-1">🎉</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Birthdays List */}
        <div className="backdrop-blur-sm rounded-2xl sm:rounded-3xl border overflow-hidden" 
             style={{ 
               backgroundColor: 'rgba(255, 255, 255, 0.02)', 
               borderColor: 'rgba(255, 255, 255, 0.08)',
               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
             }}>
          <div className="px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-6 border-b" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderBottomColor: 'rgba(255, 255, 255, 0.08)' }}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                Your Birthdays
              </h3>
              <span className="inline-flex px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm font-medium border w-fit" 
                    style={{ 
                      background: 'rgba(0, 192, 139, 0.15)', 
                      color: '#22D3A5',
                      borderColor: 'rgba(0, 192, 139, 0.3)'
                    }}>
                {birthdays.length} {birthdays.length === 1 ? 'birthday' : 'birthdays'}
              </span>
            </div>
          </div>

          {birthdays.length === 0 ? (
            <div className="px-4 py-12 sm:px-8 sm:py-24 text-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8" 
                   style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <svg className="w-8 h-8 sm:w-12 sm:h-12" style={{ color: 'rgba(255, 255, 255, 0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v1m6-1v1m-6 0h6M6 7H3a1 1 0 00-1 1v11a1 1 0 001 1h18a1 1 0 001-1V8a1 1 0 00-1-1h-3" />
                </svg>
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>No birthdays yet</h4>
              <p className="mb-6 sm:mb-12 max-w-lg mx-auto text-base sm:text-xl leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Add birthdays manually or create an invite link to let friends add their own birthdays.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => router.push('/dashboard/add')}
                  className="px-6 py-3 sm:px-8 sm:py-4 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 text-base min-h-[48px]"
                  style={{ 
                    background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
                  }}
                >
                  Add Birthday
                </button>
                <button
                  onClick={() => createInvite(true)}
                  className="px-6 py-3 sm:px-8 sm:py-4 font-semibold rounded-full border-2 transition-all duration-300 transform hover:scale-105 text-base min-h-[48px]"
                  style={{ 
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    backgroundColor: 'transparent'
                  }}
                >
                  Create Invite Link
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              {birthdays.map((birthday) => (
                <div
                  key={birthday.id}
                  className="px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-6 transition-all duration-300 hover:bg-white hover:bg-opacity-[0.02]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 flex-1 min-w-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-xl shadow-lg flex-shrink-0" 
                           style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}>
                        {birthday.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 truncate" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                          {birthday.name}
                        </h4>
                        <p className="text-sm sm:text-base mb-1 truncate" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {new Date(birthday.date_of_birth).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        {birthday.notes && (
                          <p className="text-xs sm:text-sm italic truncate" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            "{birthday.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                      <button
                        onClick={() => router.push(`/dashboard/edit/${birthday.id}`)}
                        className="p-2 sm:p-3 rounded-xl transition-all duration-300 hover:scale-110"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteBirthday(birthday.id)}
                        className="p-2 sm:p-3 rounded-xl transition-all duration-300 hover:scale-110"
                        style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)' }}
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#FF6B6B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Footer - moved outside main and before popups */}
      <footer className="backdrop-blur-sm border-t relative z-10" style={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderTopColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}>
                <svg className="w-3 h-3 sm:w-5 sm:h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                Birthday<span style={{ color: '#22D3A5' }}>Reminder</span>
              </div>
            </div>
            <p className="text-base sm:text-lg mb-2 text-white" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              © 2025 BirthdayReminder. Never miss a birthday again.
            </p>
            <p className="text-sm sm:text-base" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Built with love in Madrid by <span style={{ color: '#22D3A5' }}>Carl Lichtl</span>
            </p>
          </div> 
        </div>
      </footer>

      {/* Export Success Popup */}
      <ExportSuccessPopup 
        isOpen={showExportSuccess} 
        onClose={() => setShowExportSuccess(false)} 
      />

      {/* Auto-Sync Success Popup */}
      <AutoSyncSuccessPopup 
        isOpen={showAutoSyncSuccess} 
        onClose={() => setShowAutoSyncSuccess(false)} 
      />
    </div>
  );
}
