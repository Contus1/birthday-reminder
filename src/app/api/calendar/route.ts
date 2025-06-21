import { NextResponse } from 'next/server';
import ical, { ICalAlarmType, ICalEventRepeatingFreq } from 'ical-generator';
import { createClient } from '@supabase/supabase-js';

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token parameter' }, { status: 400 });
  }

  try {
    // 1) Look up the invite to get the user_id
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('invites')
      .select('user_id')
      .eq('invite_code', token)
      .single();

    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
    }

    // 2) Fetch birthdays for this user
    const { data: birthdays, error: fetchError } = await supabaseAdmin
      .from('birthdays')
      .select('*')
      .eq('user_id', invite.user_id);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // 3) Build ICS with PUBLISH method (default for subscriptions)
    const cal = ical({ 
      name: 'Birthday Reminders',
      description: 'Live birthday calendar subscription'
    });

    if (birthdays && birthdays.length > 0) {
      for (const b of birthdays) {
        const [y, m, d] = b.date_of_birth.split('-').map(Number);
        const start = new Date(y, m - 1, d, 9, 0);

        const ev = cal.createEvent({
          start,
          allDay: false,
          summary: `${b.name}'s Birthday`,
          description: b.notes?.trim() || `Wish ${b.name} a happy birthday!`,
          repeating: { freq: ICalEventRepeatingFreq.YEARLY },
        });
        ev.createAlarm({
          type: ICalAlarmType.display,
          trigger: 0,
          description: `Reminder: ${b.name}'s birthday is today`,
        });
      }
    }

    const icsString = cal.toString();

    // 4) Return ICS without Content-Disposition for subscription
    return new NextResponse(icsString, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Cache-Control': 'max-age=0, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Calendar subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}