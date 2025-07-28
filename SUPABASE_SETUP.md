# Supabase Integration Setup for ClassConnect

This guide will help you set up Supabase integration for your ClassConnect application.

## Prerequisites

1. Install Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Make sure you have Docker installed and running.

## Setup Steps

### 1. Initialize Supabase (if not already done)

```bash
supabase init
```

### 2. Start Supabase locally

```bash
supabase start
```

This will start the local Supabase instance and provide you with:

- Local API URL: `http://127.0.0.1:54321`
- Local DB URL: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`
- Studio URL: `http://127.0.0.1:54323`
- Inbucket URL: `http://127.0.0.1:54324`

### 3. Apply the database schema

The migration file `supabase/migrations/001_initial_schema.sql` contains all the necessary tables for your application. It will be applied automatically when you start Supabase.

### 4. Set up environment variables

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=your-anon-key-from-supabase-start
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase-start

# For client-side (Vite)
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase-start
```

### 5. Update your application

The following files have been created/updated:

- `lib/supabase.ts` - Server-side Supabase configuration
- `client/src/lib/supabase.ts` - Client-side Supabase configuration
- `server/supabaseStorage.ts` - Supabase storage implementation
- `server/routes.ts` - Updated routes to use Supabase storage
- `supabase/migrations/001_initial_schema.sql` - Database schema
- `supabase/config.toml` - Supabase configuration

### 6. Test the integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Test the API endpoints:

   ```bash
   # Create a user
   curl -X POST http://localhost:2000/api/users \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "password123"}'

   # Get all classes
   curl http://localhost:2000/api/classes

   # Create a class
   curl -X POST http://localhost:2000/api/classes \
     -H "Content-Type: application/json" \
     -d '{"name": "Mathematics 101", "student_count": 25}'
   ```

## Production Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and API keys

### 2. Update environment variables

Replace the local URLs with your production Supabase URLs:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### 3. Apply migrations to production

```bash
supabase db push
```

## Database Schema

The following tables are created:

- **users**: User accounts with username and password
- **classes**: Class information with name and student count
- **students**: Student records with class associations
- **grades**: Grade records for students
- **attendance**: Attendance tracking for students
- **assignments**: Assignment information

## API Endpoints

### Users

- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/username/:username` - Get user by username

### Classes

- `GET /api/classes` - Get all classes
- `POST /api/classes` - Create a new class
- `GET /api/classes/:id` - Get class by ID

### Students

- `GET /api/students` - Get all students
- `POST /api/students` - Create a new student
- `GET /api/students/:id` - Get student by ID
- `GET /api/classes/:classId/students` - Get students by class

### Grades

- `GET /api/grades` - Get all grades
- `POST /api/grades` - Create a new grade
- `GET /api/students/:studentId/grades` - Get grades by student

### Attendance

- `GET /api/attendance` - Get all attendance records
- `POST /api/attendance` - Create a new attendance record
- `GET /api/students/:studentId/attendance` - Get attendance by student
- `GET /api/attendance/date/:date` - Get attendance by date

### Assignments

- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create a new assignment
- `GET /api/assignments/:id` - Get assignment by ID

## Security

The database includes Row Level Security (RLS) policies that allow public access to all tables. In production, you should:

1. Implement proper authentication
2. Create more restrictive RLS policies
3. Use environment-specific API keys
4. Enable SSL connections

## Troubleshooting

### Common Issues

1. **Connection refused**: Make sure Supabase is running (`supabase start`)
2. **Authentication errors**: Check your API keys in the environment variables
3. **Migration errors**: Run `supabase db reset` to reset the database
4. **CORS issues**: Update the `additional_redirect_urls` in `supabase/config.toml`

### Useful Commands

```bash
# Start Supabase
supabase start

# Stop Supabase
supabase stop

# Reset database
supabase db reset

# View logs
supabase logs

# Generate types (if using TypeScript)
supabase gen types typescript --local > types/supabase.ts
```

## Next Steps

1. Implement authentication using Supabase Auth
2. Add real-time subscriptions for live updates
3. Set up file storage for assignments and profile pictures
4. Implement email notifications
5. Add data validation and sanitization
6. Set up automated backups
7. Monitor performance and optimize queries

## Support

For more information about Supabase:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
