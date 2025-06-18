// src/app/dashboard/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';

export default function AddBirthday() {
  const router = useRouter();

  // form state
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [notes, setNotes] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1) get the logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Auth error:', userError);
      alert('Auth failure, please log in again.');
      router.push('/login');
      return;
    }
    if (!user) {
      router.push('/login');
      return;
    }

    // 2) try inserting the row
    const { data, error } = await supabase
      .from('birthdays')
      .insert([
        {
          user_id: user.id,
          name,
          date_of_birth: dob,
          notes: notes || null,
        },
      ]);

    // 3) log the result so we can debug
    console.log('Insert result:', { data, error });

    if (error) {
      alert('Failed to save birthday: ' + error.message);
      setLoading(false);
      return;
    }

    // 4) on success, go back to the dashboard
    router.push('/dashboard');
  };

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Add Birthday</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-medium">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Date of Birth</label>
          <input
            required
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            disabled={loading}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
      </form>
    </main>
  );
}
