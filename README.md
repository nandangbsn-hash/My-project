# SchoolHub - AI-Powered School Learning Platform

A comprehensive SaaS platform that combines AI-powered doubt solving with homework management for schools. Built with React, Supabase, and modern web technologies.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
npm run preview
```

## Features

### 🎓 For Students
- **AI Doubt Solver** - Ask questions via text or images, get instant AI-powered explanations
- **Homework Dashboard** - Track all assignments with deadline countdown and urgency indicators
- **Smart Notifications** - Never miss a deadline
- **Anonymous Questions** - Ask doubts without revealing identity
- **Progress Tracking** - See your submission status and grades

### 👨‍🏫 For Teachers
- **Create Assignments** - Post homework with priority levels and categories
- **Student Analytics** - Track which topics students struggle with
- **Manage Doubts** - Review and provide feedback on student questions
- **Grade Submissions** - Manage student work and provide feedback
- **Upload Resources** - Share class notes and study materials
- **Instant Notifications** - Students get real-time updates

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Email/Password) |
| **Real-time** | Supabase Realtime |
| **Icons** | Lucide React |
| **Charts** | Recharts |

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── lib/                # Utility libraries
├── pages/              # Page components
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Key Features Implemented

### ✅ Authentication
- Email/password sign-up and login
- Role-based access (Student/Teacher/Admin)
- Protected routes
- Persistent sessions

### ✅ Database
- 6 main tables with relationships
- Row Level Security (RLS) policies
- Indexed queries for performance
- Foreign key constraints

### ✅ Student Features
- Dashboard with stats
- Homework list with urgency colors
- Ask doubt interface with image upload
- Doubt history and AI responses
- Anonymous question mode

### ✅ Teacher Features
- Dashboard with statistics
- Create and manage assignments
- View student doubts
- Grade submissions
- Upload class notes

### ✅ UI/UX
- Modern, clean design
- Smooth animations
- Responsive layout
- Intuitive navigation
- Color-coded urgency indicators

## Database Tables

- `users` - User profiles and authentication
- `homework_tasks` - Assignments and notices
- `doubt_questions` - Student questions
- `class_notes` - Teacher resources
- `homework_submissions` - Student submissions
- `notifications` - System notifications

All with Row Level Security (RLS) for data protection.

## Environment Variables

```
VITE_SUPABASE_URL          # Your Supabase project URL
VITE_SUPABASE_ANON_KEY     # Your Supabase anonymous key
```

## Deployment

Frontend can be deployed to:
- Vercel (recommended)
- Netlify
- GitHub Pages

Backend runs on Supabase (automatic).

## Next Steps

1. Integrate OpenAI/Gemini APIs for better AI responses
2. Add email notifications via Gmail API
3. Implement real-time chat
4. Create mobile app with React Native

## More Information

See `SETUP.md` for detailed documentation and advanced setup instructions.