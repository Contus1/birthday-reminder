// src/app/dashboard/page.tsx
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

  // logout button
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error);
    else router.push('/login');
  };

  // generate & save an invite_code
  const createInvite = async () => {
    // get session
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

    // build the full link for your app
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
        .eq('user_id', userId);

      if (error) console.error('Fetch birthdays error:', error);
      else setBirthdays(data || []);
      setLoading(false);
    })();
  }, [router]);

  if (loading) return <p>Loading…</p>;

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Birthdays</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Invite Link Generator */}
      <div className="mb-6">
        <button
          onClick={createInvite}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Generate Invite Link
        </button>
        {inviteLink && (
          <p className="mt-2 break-all">
            Share this link with friends:<br />
            <a
              href={inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {inviteLink}
            </a>
          </p>
        )}
      </div>

      <a
        href="/dashboard/add"
        className="inline-block mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Add Birthday
      </a>

      {birthdays.length === 0 ? (
        <p>No birthdays yet.</p>
      ) : (
        <ul className="space-y-4">
          {birthdays.map((b) => (
            <li key={b.id} className="p-4 border rounded-lg">
              <div className="font-semibold">{b.name}</div>
              <div className="text-gray-600">
                {new Date(b.date_of_birth).toLocaleDateString()}
              </div>
              {b.notes && (
                <div className="text-sm text-gray-500 mt-1">{b.notes}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
