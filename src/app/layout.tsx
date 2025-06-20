// src/app/layout.tsx
import './globals.css'

export const metadata = {
  title: 'BirthdayReminder - Never Miss a Birthday Again',
  description: 'The easiest way to collect, manage and never miss your friends\' birthdays.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
