# Authentication Integration Guide

This document explains the Supabase Auth integration for ClassConnect.

## Overview

The authentication system uses Supabase Auth to provide:

- User registration and login
- Password reset functionality
- Session management
- Row Level Security (RLS) for data protection
- Role-based access control

## Features Implemented

### 1. Authentication Context (`AuthContext.tsx`)

- Manages authentication state across the application
- Provides login, logout, registration, and password reset functions
- Handles session persistence and auth state changes

### 2. Authentication Pages

- **Login Page** (`/login`): User sign-in with email/password
- **Register Page** (`/register`): New user registration with role selection
- **Forgot Password Page** (`/forgot-password`): Password reset via email

### 3. Protected Routes

- All main application routes are protected
- Unauthenticated users are redirected to login
- Role-based access control (teacher, student, admin)

### 4. Database Security

- Row Level Security (RLS) policies on all tables
- Users can only access their own data
- Automatic user profile creation on registration

## Setup Instructions

### 1. Environment Variables

Ensure your `.env` file contains:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

Run the `auth_setup.sql` script in your Supabase SQL editor to:

- Enable RLS on all tables
- Create security policies
- Set up automatic user profile creation
- Grant necessary permissions

### 3. Supabase Auth Configuration

In your Supabase dashboard:

1. Go to Authentication > Settings
2. Configure email templates for:
   - Email confirmation
   - Password reset
3. Set up redirect URLs for password reset

## Usage

### User Registration

1. Navigate to `/register`
2. Fill in personal information and select user type
3. Confirm email address
4. User profile is automatically created in the database

### User Login

1. Navigate to `/login`
2. Enter email and password
3. Access to protected routes is granted

### Password Reset

1. Navigate to `/forgot-password`
2. Enter email address
3. Check email for reset link
4. Set new password

### Logout

- Click "Sign Out" in the sidebar
- Session is cleared and user is redirected to login

## Security Features

### Row Level Security (RLS)

- **users table**: Users can only access their own profile
- **teachers table**: Teachers can only access their own teacher record
- **classes table**: Teachers can only access classes they teach
- **schedules table**: Users can only access their own schedules
- **time_slots table**: Public read access, admin-only modifications

### Automatic Profile Creation

When a user registers:

1. Auth user is created in `auth.users`
2. Trigger automatically creates profile in `users` table
3. If user type is "teacher", `teachers` record is created

## API Functions

### AuthContext Methods

```typescript
const {
  user, // Current authenticated user
  session, // Current session
  loading, // Loading state
  signIn, // Login function
  signUp, // Registration function
  signOut, // Logout function
  resetPassword, // Password reset function
  updatePassword, // Update password function
} = useAuth();
```

### Protected Route Component

```typescript
<ProtectedRoute requiredUserType="teacher">
  <TeacherOnlyComponent />
</ProtectedRoute>
```

## Database Schema Integration

The authentication system integrates with the existing database schema:

- **users table**: Stores user profiles with auth user ID as primary key
- **teachers table**: Links to users table via user_id
- **classes table**: Links to teachers table via teacher_id
- **schedules table**: Links to users table via user_id
- **time_slots table**: Reference table for time slots

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**

   - Check that `.env` file contains correct Supabase URL and anon key

2. **"Policy violation" errors**

   - Ensure RLS policies are properly set up in database
   - Check that user has correct permissions

3. **Email confirmation not working**

   - Verify email templates are configured in Supabase
   - Check spam folder for confirmation emails

4. **User profile not created**
   - Ensure the `handle_new_user()` trigger function is created
   - Check that the trigger is properly attached to `auth.users`

### Debug Mode

Enable console logging in development to debug authentication issues:

```typescript
// In AuthContext.tsx, add console.log statements
console.log("Auth state changed:", { user, session });
```

## Next Steps

1. **Email Templates**: Customize email templates in Supabase dashboard
2. **Social Auth**: Add Google, GitHub, or other social login providers
3. **Multi-factor Authentication**: Enable MFA for enhanced security
4. **User Management**: Create admin interface for user management
5. **Audit Logging**: Add logging for authentication events

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files to version control
2. **HTTPS**: Always use HTTPS in production
3. **Password Policy**: Enforce strong password requirements
4. **Session Management**: Implement proper session timeout
5. **Rate Limiting**: Add rate limiting for auth endpoints
6. **Input Validation**: Validate all user inputs on both client and server
