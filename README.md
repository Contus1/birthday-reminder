# BirthdayReminder

A collaborative web app that helps families and friends never forget a birthday again.  
Built with **Next.js 15**, **Supabase**, and **Tailwind CSS**, BirthdayReminder makes it simple to collect, share, and subscribe to birthdays in one central place.

---

## Overview

### Problem  
Most people rely on personal reminders or social media notifications, both unreliable for shared birthday management. Existing calendar apps rarely offer a simple way for groups to manage birthdays collaboratively.

### Solution  
BirthdayReminder provides a shared, privacy-friendly platform where users can gather birthdays together, receive automatic reminders, and export them directly to their personal calendars (.ics or webcal://). The app is designed to be clean, fast, and intuitive across all devices.

---

## Motivation

Forgetting birthdays is a common issue in the digital age. BirthdayReminder addresses this by combining collaborative data management, seamless automation, and minimal user friction.  
It’s not just a tool — it’s a small way to stay thoughtful and connected.

---

## Tech Stack

- **Frontend:** Next.js 15 with App Router and Server Components  
- **Styling:** Tailwind CSS and Framer Motion  
- **Backend:** Supabase (Authentication, Real-time Database, Row Level Security)  
- **Mailing:** Nodemailer and SendGrid for transactional emails  
- **Calendar Integration:** iCal Generator for .ics exports  
- **Language:** TypeScript  
- **Deployment:** Vercel

---

## Architecture Highlights

The application uses the **Next.js App Router** for modern server-side rendering and API routes.  
Supabase handles authentication and secure real-time data access through Row Level Security (RLS) policies.  
Email delivery is managed through SendGrid via Nodemailer, ensuring reliability and tracking.


## Key Features

- Collaborative birthday collection for groups and families  
- Real-time data sync with Supabase  
- Automatic email reminders  
- Calendar export (.ics and webcal:// support)  
- Responsive, minimal UI  
- Progressive Web App functionality  


## Setup and Development

### Clone Repository
```bash
git clone https://github.com/Contus1/BirthdayReminder.git
cd BirthdayReminder

