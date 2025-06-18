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

  if (status === 'loading') return <p>Loading form…</p>;
  if (status === 'error')   return <p className="text-red-600">Invalid invite code or an error occurred.</p>;
  if (status === 'sent')    return <p className="text-green-600">Thank you! Your birthday has been recorded.</p>;

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Enter Your Birthday</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Date of Birth</label>
          <input
            required
            type="date"
            value={form.date_of_birth}
            onChange={(e) => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
