'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../supabaseClient';

export default function EditBirthday() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchBirthday = async () => {
      try {
        const { data } = await supabase
          .from('birthdays')
          .select('*')
          .eq('id', id)
          .single();
        if (data) {
          setName(data.name);
          setDob(data.date_of_birth);
          setNotes(data.notes || '');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBirthday();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase
      .from('birthdays')
      .update({ name, date_of_birth: dob, notes: notes || null })
      .eq('id', id);
    router.push('/dashboard');
  };

  if (loading) return <p>Loading…</p>;

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Edit Birthday</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {/* same fields as in AddBirthday */}
        <div>
          <label>Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            required
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <div>
          <label>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Update
        </button>
      </form>
    </main>
  );
}
