# SchoolHub - AI-Powered School Platform

A comprehensive SaaS platform combining AI-powered doubt solving and homework management for schools.

## Project Overview

SchoolHub is a full-stack application built with modern web technologies that helps students and teachers collaborate effectively through:

- **Smart Doubt Helper**: AI-powered question answering system with image recognition
- **Homework & Notice Manager**: Centralized assignment and deadline management
- **Analytics Dashboard**: Teacher insights into student performance and question trends
- **Student Dashboard**: Real-time homework tracking and urgency indicators

## Technology Stack

### Frontend
- **React 18.3** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Lucide Icons** - Icon library

### Backend & Database
- **Supabase** - PostgreSQL database with built-in authentication
- **PostgREST** - Instant REST API
- **Row Level Security (RLS)** - Data protection policies

### Key Libraries
- `@supabase/supabase-js` - Supabase client
- `date-fns` - Date utilities
- `recharts` - Chart library
- `@vitejs/plugin-react` - React support for Vite

## Database Schema

### Tables Created

1. **users** - User profiles and roles
   - id, name, email, role, class/subject, school, avatar_url

2. **homework_tasks** - Assignments and notices
   - id, teacher_id, title, subject, description, deadline, category, priority, ai_summary

3. **doubt_questions** - Student questions
   - id, student_id, question_text, question_image_url, ai_answer, references, chapter_tag

4. **class_notes** - Teacher resources
   - id, teacher_id, subject, chapter, notes_url, keywords

5. **homework_submissions** - Student submissions
   - id, homework_id, student_id, status, grade, feedback

6. **notifications** - System notifications
   - id, user_id, title, message, type, read status

All tables have:
- Row Level Security (RLS) enabled
- Proper foreign key constraints
- Indexed columns for performance
- Timestamps for audit trails

## Environment Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   The following are already configured in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Database Setup**
   Migrations have been automatically applied to create all required tables:
   - `create_users_table`
   - `create_homework_tasks_table`
   - `create_doubt_questions_table`
   - `create_class_notes_table`
   - `create_homework_submissions_table`
   - `create_notifications_table`

## Running the Application

### Development Mode
```bash
npm run dev
```
Opens at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Features by Role

### Student Features
- **Dashboard**: View upcoming homework with urgency indicators
- **Homework Tracking**: See all assignments in one place with deadline countdowns
- **Ask Doubts**: Upload images, ask questions, get AI explanations
- **Anonymous Mode**: Ask questions without revealing identity
- **Notifications**: Real-time alerts for new assignments
- **Submission Tracking**: Track homework submission status

### Teacher Features
- **Create Assignments**: Post homework with deadlines and priorities
- **Analytics Dashboard**: See which topics students struggle with
- **Student Insights**: Track which students need help
- **Grade Submissions**: Review and grade student work
- **Upload Resources**: Share class notes and study materials
- **Doubt Management**: Review and respond to student questions

### Admin Features
- **User Management**: Create and manage accounts
- **School Settings**: Configure school information
- **Analytics**: School-wide performance metrics

## File Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # Navigation sidebar
│   └── ProtectedRoute.jsx   # Route protection wrapper
├── contexts/
│   └── AuthContext.jsx      # Authentication context and hooks
├── lib/
│   └── supabase.js          # Supabase client initialization
├── pages/
│   ├── Login.jsx            # Login page
│   ├── Signup.jsx           # Registration page
│   ├── StudentDashboard.jsx # Student home
│   ├── TeacherDashboard.jsx # Teacher home
│   ├── HomeworkPage.jsx     # Homework listing
│   └── DoubtHelper.jsx      # AI question interface
├── App.jsx                  # Main app routing
├── main.jsx                 # Entry point
└── index.css                # Global styles

Configuration Files:
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # TailwindCSS configuration
├── postcss.config.js        # PostCSS configuration
├── index.html               # HTML template
└── package.json             # Dependencies
```

## Authentication Flow

1. User signs up with email and password
2. Supabase creates auth user and stores profile in `users` table
3. JWT token stored in browser session
4. Protected routes check authentication state
5. RLS policies ensure users can only access their own data

### User Roles
- **student** - Can ask doubts, view homework, submit assignments
- **teacher** - Can create homework, review doubts, grade submissions
- **admin** - Full platform access

## Key Features Implementation

### Smart Doubt Helper
- Text-based questions with AI response
- Image upload with OCR support (ready for integration)
- Anonymous question option
- Reference links and learning resources
- Teacher review and feedback system

### Homework Management
- Create with deadline, priority, and category
- Deadline countdown with urgency colors
- Student submission tracking
- Grade assignment
- Bulk deadline notifications

### Real-time Updates
- Supabase real-time subscriptions ready
- Notification system implemented
- Update timestamps on all records

### Security
- Row Level Security (RLS) on all tables
- Email/password authentication
- JWT-based sessions
- Protected API endpoints
- User data isolation

## Customization Guide

### Adding Features
1. Create new table migrations in Supabase
2. Add RLS policies for security
3. Create React components for UI
4. Use `useAuth()` hook for user context
5. Implement API calls with Supabase client

### Styling
- Colors defined in `tailwind.config.js`
- Primary/Secondary/Success/Warning/Danger palettes
- Custom fonts and animations
- Responsive breakpoints configured

### Integrations
The platform is ready for:
- **OpenAI/Gemini APIs**: For enhanced AI doubt responses
- **Google Calendar API**: For deadline syncing
- **Gmail API**: For email notifications
- **WhatsApp/Telegram**: For message notifications

## Performance Optimizations

- Indexed database queries
- Lazy-loaded components
- Optimized images and assets
- Tailwind CSS purging
- React Router code splitting ready

## Deployment

### Vercel (Recommended for Frontend)
```bash
npm run build
vercel deploy
```

### Other Platforms
- Netlify
- GitHub Pages
- Self-hosted with Docker

### Database
Supabase handles all backend hosting and scaling.

## Troubleshooting

### Authentication Issues
- Clear browser cookies and localStorage
- Check Supabase auth settings
- Verify JWT token expiration

### Database Issues
- Check RLS policies in Supabase console
- Verify table permissions
- Check for foreign key constraints

### Build Issues
- Clear `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (18+)

## Future Enhancements

1. **AI Improvements**
   - Integrate GPT-4/Gemini APIs
   - OCR for image question parsing
   - Semantic search in class notes
   - Automated answer generation

2. **Communication**
   - Real-time chat system
   - Video conferencing integration
   - WhatsApp/Telegram bots
   - Email reminders

3. **Analytics**
   - Student performance graphs
   - Trend analysis
   - Predictive interventions
   - Class benchmarking

4. **Mobile**
   - React Native app
   - Offline mode
   - Push notifications

5. **Social**
   - Student study groups
   - Peer tutoring marketplace
   - Discussion forums
   - Achievement badges

## Support & Documentation

For Supabase documentation: https://supabase.com/docs
For React Router docs: https://reactrouter.com
For Tailwind CSS: https://tailwindcss.com

## License

This is a demo/sample project for educational purposes.

---

**Created**: November 23, 2025
**Version**: 1.0.0
