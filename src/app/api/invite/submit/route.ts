import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server‐side client with service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { code, name, date_of_birth, notes } = await req.json();

    // 1. Look up the invite to get the host's user_id
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('invites')
      .select('user_id')
      .eq('invite_code', code)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json(
        { error: 'Invalid invite code.' },
        { status: 400 }
      );
    }

    // 2. Insert the birthday on behalf of the host
    const { error: insertError } = await supabaseAdmin
      .from('birthdays')
      .insert([
        {
          user_id: invite.user_id,
          name,
          date_of_birth,
          notes: notes || null,
        },
      ]);

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to save birthday.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Unexpected server error.' },
      { status: 500 }
    );
  }
}
