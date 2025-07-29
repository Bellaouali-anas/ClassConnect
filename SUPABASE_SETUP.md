# Supabase Database Integration Setup

## Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```env
VITE_SUPABASE_URL=https://wicoqmuwlckvehjnhbzp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpY29xbXV3bGNrdmVoam5oYnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3OTc4MjgsImV4cCI6MjA2OTM3MzgyOH0.TGv1FtXPO3G1z1atrrIWV09SBV_O-ff60Iy5TDQ8lE8
```

## Database Schema

The application is configured for the following Supabase database structure:

### Users Table

- `id` (bigint, primary key, auto-increment)
- `created_at` (timestamp with time zone, default: now())
- `First_name` (text, NOT NULL, default: '')
- `Last_name` (text, NOT NULL, default: '')
- `Email` (text, NOT NULL, UNIQUE)
- `Phone` (text, optional)
- `Age` (integer, optional)
- `Gender` (character varying, optional)
- `Address` (text, optional)
- `CIty` (text, optional)
- `Bio` (text, optional)
- `User_type` (text, optional)

### Teachers Table

- `id` (bigint, primary key, auto-increment)
- `created_at` (timestamp with time zone, default: now())
- `Experience_Years` (integer, optional)
- `Subjects` (ARRAY, optional)
- `Schools` (ARRAY, optional)
- `User_Id` (bigint, foreign key to Users.id)

### Classes Table

- `id` (bigint, primary key, auto-increment)
- `created_at` (timestamp with time zone, default: now())
- `Class_Name` (text, optional)
- `Level` (character varying, optional)
- `Grade` (text, optional)
- `subject` (text, optional)
- `Description` (text, optional)
- `Classroom` (text, optional)
- `Hours` (real, optional)
- `Max_Students` (bigint, optional)
- `School` (text, optional)
- `Hourly_Payement` (text, optional)
- `Teacher_id` (bigint, NOT NULL, foreign key to Teachers.id)

## Database Generation

Use the provided `database_schema.sql` file to create the database structure:

1. **In Supabase Dashboard:**

   - Go to SQL Editor
   - Copy and paste the contents of `database_schema.sql`
   - Run the script

2. **Or use the Supabase CLI:**
   ```bash
   supabase db reset
   ```

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables in `client/.env`
3. Ensure your Supabase database has the required tables
4. Start the development server: `npm run dev`

## Database Services

The application includes the following database services:

- `userService` - User management operations
- `teacherService` - Teacher profile and data operations
- `classService` - Class management operations

All services are located in `client/src/lib/database.ts`

## Custom Hooks

React hooks for managing database state:

- `useClasses(teacherId)` - Class management
- `useTeacher(teacherId)` - Teacher profile management
- `useUser(userId)` - User data management

All hooks are located in `client/src/hooks/useDatabase.ts`

## Key Features

- **Type Safety** - Full TypeScript support with proper interfaces
- **Error Handling** - Comprehensive error handling for all database operations
- **Row Level Security** - Built-in RLS policies for data protection
- **Real-time Updates** - Ready for Supabase real-time features
- **Optimized Queries** - Proper indexing for performance

## Notes

- All table names use PascalCase (Users, Teachers, Classes)
- Foreign key relationships are properly configured
- RLS policies ensure data security
- The schema supports the existing application features
