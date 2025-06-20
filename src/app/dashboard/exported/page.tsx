// src/app/dashboard/exported/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';

type ExportedBirthday = {
  id: string;
  user_id: string;
  name: string;
  date_of_birth: string;
  notes: string | null;
  exported_at: string;
};

export default function ExportedBacklog() {
  const router = useRouter();
  const [items, setItems] = useState<ExportedBirthday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 1) ensure user is logged in
      const {
        data: { session },
        error: authErr,
      } = await supabase.auth.getSession();

      if (authErr || !session) {
        router.push('/login');
        return;
      }

      // 2) fetch exported_birthdays for this user
      const { data, error } = await supabase
        .from('exported_birthdays')
        .select('*')
        .eq('user_id', session.user.id)
        .order('exported_at', { ascending: false });

      if (error) {
        console.error('Error fetching backlog:', error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    })();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
        <div className="flex flex-col items-center space-y-6 sm:space-y-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-20 sm:w-20 border-4 border-[#1A1A1A] border-t-[#00C08B]"></div>
            <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: 'linear-gradient(135deg, rgba(0, 192, 139, 0.1) 0%, rgba(0, 176, 213, 0.1) 100%)' }}></div>
          </div>
          <p className="text-white text-lg sm:text-xl font-medium animate-pulse text-center" style={{ fontWeight: 500, letterSpacing: '-0.02em' }}>Loading export history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Navigation Header */}
      <nav className="backdrop-blur-xl border-b sticky top-0 z-50" style={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderBottomColor: 'rgba(255, 255, 255, 0.08)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 transition-colors duration-300 hover:text-white"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium text-sm sm:text-base">Back</span>
              </button>
            </div>
            
            <div className="text-base sm:text-lg font-semibold text-white" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
              Export History
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-16">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8" 
               style={{ background: 'rgba(0, 192, 139, 0.15)' }}>
            <svg className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: '#22D3A5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
            Export <span style={{ color: '#22D3A5' }}>History</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-4xl mx-auto px-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            View all the birthdays you've exported to your calendar and received email reminders for.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-16">
          <div className="backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border text-center transition-all duration-500 hover:scale-105" 
               style={{ 
                 backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                 borderColor: 'rgba(255, 255, 255, 0.08)',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
               }}>
            <div className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4" style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {items.length}
            </div>
            <div className="font-medium text-sm sm:text-base text-white" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Exports</div>
          </div>
          <div className="backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border text-center transition-all duration-500 hover:scale-105" 
               style={{ 
                 backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                 borderColor: 'rgba(255, 255, 255, 0.08)',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
               }}>
            <div className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4" style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {items.length > 0 ? new Date(items[0].exported_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
            </div>
            <div className="font-medium text-sm sm:text-base text-white" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Last Export</div>
          </div>
          <div className="backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 border text-center transition-all duration-500 hover:scale-105" 
               style={{ 
                 backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                 borderColor: 'rgba(255, 255, 255, 0.08)',
                 boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
               }}>
            <div className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4" style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {new Set(items.map(item => item.name)).size}
            </div>
            <div className="font-medium text-sm sm:text-base text-white" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Unique People</div>
          </div>
        </div>

        {/* Exported Items List */}
        <div className="backdrop-blur-sm rounded-2xl sm:rounded-3xl border overflow-hidden" 
             style={{ 
               backgroundColor: 'rgba(255, 255, 255, 0.02)', 
               borderColor: 'rgba(255, 255, 255, 0.08)',
               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
             }}>
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-b" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderBottomColor: 'rgba(255, 255, 255, 0.08)' }}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg sm:text-2xl font-bold text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                Exported Birthdays
              </h3>
              <span className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border" 
                    style={{ 
                      background: 'rgba(0, 192, 139, 0.15)', 
                      color: '#22D3A5',
                      borderColor: 'rgba(0, 192, 139, 0.3)'
                    }}>
                {items.length} exports
              </span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="px-4 sm:px-8 py-16 sm:py-24 text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8" 
                   style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <svg className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: 'rgba(255, 255, 255, 0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>No exports yet</h4>
              <p className="mb-8 sm:mb-12 max-w-lg mx-auto text-base sm:text-xl leading-relaxed px-4" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Once you export birthdays from your dashboard, they'll appear here with their export history.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 transform hover:scale-105 min-h-[48px]"
                style={{ 
                  background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 32px rgba(0, 192, 139, 0.3)'
                }}
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="px-4 sm:px-8 py-4 sm:py-6 transition-all duration-300 border-b last:border-b-0 hover:bg-white hover:bg-opacity-[0.02]"
                  style={{ 
                    borderBottomColor: 'rgba(255, 255, 255, 0.08)'
                  }}
                >
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg" 
                           style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}>
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-bold text-white mb-1 truncate" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                          {item.name}
                        </h4>
                        <p className="text-sm mb-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {new Date(item.date_of_birth).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {item.notes && (
                      <p className="text-sm italic mb-3 px-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        "{item.notes}"
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.05)' }}>
                      <div className="flex items-center space-x-2 text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Exported</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          {new Date(item.exported_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          {new Date(item.exported_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center space-x-4 sm:space-x-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg" 
                           style={{ background: 'linear-gradient(135deg, #00C08B 0%, #00B0D5 100%)' }}>
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-white mb-1" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                          {item.name}
                        </h4>
                        <p className="text-base sm:text-lg mb-1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Birthday: {new Date(item.date_of_birth).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        {item.notes && (
                          <p className="text-sm italic" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm mb-2" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Exported</span>
                      </div>
                      <div className="text-lg font-bold text-white mb-1">
                        {new Date(item.exported_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        {new Date(item.exported_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        {items.length > 0 && (
          <div className="mt-8 sm:mt-16 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border" style={{ backgroundColor: 'rgba(34, 211, 165, 0.1)', borderColor: 'rgba(34, 211, 165, 0.2)' }}>
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4" style={{ color: '#22D3A5', fontWeight: 700, letterSpacing: '-0.01em' }}>
                📧 Email Reminders Active
              </h3>
              <p className="text-base sm:text-lg leading-relaxed px-2" style={{ color: 'rgba(34, 211, 165, 0.8)' }}>
                You'll receive email reminders for these birthdays automatically. 
                New exports will also appear here for your records.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
