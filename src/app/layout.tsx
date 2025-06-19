// src/app/layout.tsx
import './globals.css'

export const metadata = {
  title: 'BirthdayReminder - Never Miss a Birthday Again',
  description: 'The easiest way to collect, manage and never miss your friends\' birthdays.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
