'use client';
import { useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Home() {
  useEffect(() => {
    console.log('Supabase client:', supabase);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl">Supabase is connected!</h1>
    </main>
  );
}
