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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="flex flex-col items-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500"></div>
          <p className="text-gray-600 text-lg animate-pulse">Loading export history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
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
              Export History
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Export <span className="gradient-text">History</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View all the birthdays you've exported to your calendar and received email reminders for.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-pink-500 mb-2">{items.length}</div>
            <div className="text-sm text-gray-600">Total Exports</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-pink-500 mb-2">
              {items.length > 0 ? new Date(items[0].exported_at).toLocaleDateString() : '-'}
            </div>
            <div className="text-sm text-gray-600">Last Export</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-pink-500 mb-2">
              {new Set(items.map(item => item.name)).size}
            </div>
            <div className="text-sm text-gray-600">Unique People</div>
          </div>
        </div>

        {/* Exported Items List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-xl font-bold text-gray-900">
              Exported Birthdays ({items.length})
            </h3>
          </div>

          {items.length === 0 ? (
            <div className="px-8 py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">No exports yet</h4>
              <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                Once you export birthdays from your dashboard, they'll appear here with their export history.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="px-8 py-6 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-gray-600">
                          Birthday: {new Date(item.date_of_birth).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        {item.notes && (
                          <p className="text-sm text-gray-500 mt-1 italic">
                            "{item.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Exported</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(item.exported_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
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
          <div className="mt-12 bg-pink-50 rounded-3xl p-8 border border-pink-100">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📧 Email Reminders Active
              </h3>
              <p className="text-gray-600">
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
