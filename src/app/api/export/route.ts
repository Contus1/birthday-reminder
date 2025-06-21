import { NextResponse } from 'next/server';
import ical, { ICalAlarmType, ICalEventRepeatingFreq, ICalCalendarMethod } from 'ical-generator';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Nodemailer SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  // 0) parse user info
  const { userId, userEmail } = await req.json();

  // 1) fetch only that user's birthdays
  const { data: birthdays, error: fetchError } = await supabaseAdmin
    .from('birthdays')
    .select('*')
    .eq('user_id', userId);

  if (fetchError) {
    console.error('Fetch error:', fetchError);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (!birthdays?.length) {
    return NextResponse.json(
      { message: 'No birthdays to export.' },
      { status: 200 }
    );
  }

  // 2) build the ICS with REQUEST method for calendar invites
  const cal = ical({ 
    name: `${userEmail}'s Birthdays`,
    method: ICalCalendarMethod.REQUEST
  });
  
  for (const b of birthdays) {
    const [y, m, d] = b.date_of_birth.split('-').map(Number);
    const start = new Date(y, m - 1, d, 9, 0);

    const ev = cal.createEvent({
      start,
      allDay: false,
      summary: `${b.name}'s Birthday`,
      description: b.notes?.trim() || `Wish ${b.name} a happy birthday!`,
      repeating: { freq: ICalEventRepeatingFreq.YEARLY },
      organizer: { name: 'BirthdayReminder', email: userEmail },
      attendees: [{ name: userEmail, email: userEmail }]
    });
    ev.createAlarm({
      type: ICalAlarmType.display,
      trigger: 0,
      description: `Reminder: ${b.name}'s birthday is today`,
    });
  }
  const icsString = cal.toString();

  // 3) email to the user with calendar invitation
  try {
    const info = await transporter.sendMail({
      from: `"BirthdayReminder" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: 'Your Birthday Calendar Invite',
      text: 'Here is your birthday calendar invitation. Tap "Add to Calendar" to accept.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00C08B;">🎉 Your Birthday Calendar Invite</h2>
          <p>Your birthday reminders are ready! Tap "Add to Calendar" below to add them to your calendar app.</p>
          <p>This will create recurring yearly reminders for all your friends' birthdays.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">Sent from BirthdayReminder</p>
        </div>
      `,
      alternatives: [
        {
          contentType: 'text/calendar; method=REQUEST',
          content: icsString,
        },
      ],
    });
    console.log(`Calendar invite emailed to ${userEmail}, messageId=${info.messageId}`);
  } catch (mailErr) {
    console.error('Mail error:', mailErr);
    // still continue to archive & return file
  }

  // 4) archive & delete
  try {
    const { error: archiveError } = await supabaseAdmin
      .from('exported_birthdays')
      .insert(
        birthdays.map(b => ({
          id: b.id,
          user_id: b.user_id,
          name: b.name,
          date_of_birth: b.date_of_birth,
          notes: b.notes,
          exported_at: new Date().toISOString(),
        }))
      );
    if (archiveError) {
      console.error('Archive error:', archiveError);
    }
  } catch (e) {
    console.error('Archive error:', e);
  }

  const ids = birthdays.map(b => b.id);
  try {
    const { error: deleteError } = await supabaseAdmin
      .from('birthdays')
      .delete()
      .in('id', ids);
    if (deleteError) {
      console.error('Delete error:', deleteError);
    }
  } catch (e) {
    console.error('Delete error:', e);
  }

  // 5) return file
  return new NextResponse(icsString, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="birthdays.ics"',
    },
  });
}
