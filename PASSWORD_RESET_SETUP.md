# Password Reset Setup Guide

This document explains how the password reset functionality works in ClassConnect and how to configure it properly.

## Overview

The password reset system allows users to:

1. Request a password reset via email
2. Click a secure link in their email
3. Set a new password on a dedicated reset page
4. Sign in with their new password

## Components

### 1. ForgotPassword Page (`/forgot-password`)

- Users enter their email address
- System sends a password reset email
- Shows success message after sending

### 2. ResetPassword Page (`/reset-password`)

- Users land here after clicking the email link
- Validates the reset session
- Allows setting a new password
- Shows success message after password update

### 3. AuthContext Updates

- Enhanced with password reset session detection
- Provides `isPasswordResetSession` flag
- Handles password update functionality

## Flow Diagram

```
User forgets password
       ↓
   /forgot-password
       ↓
   Enter email → Send reset email
       ↓
   User clicks email link
       ↓
   /reset-password (with session)
       ↓
   Enter new password → Update password
       ↓
   Success → Redirect to login
```

## Setup Instructions

### 1. Supabase Configuration

In your Supabase dashboard:

1. **Go to Authentication > Settings**
2. **Configure Email Templates**:

   - **Password Reset Email**: Customize the email template
   - **Redirect URL**: Set to `https://yourdomain.com/reset-password`
   - **Site URL**: Set to `https://yourdomain.com`

3. **Email Settings**:
   - Ensure SMTP is configured or use Supabase's email service
   - Test email delivery

### 2. Environment Variables

Ensure your `.env` file contains:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Permissions

The password reset flow uses Supabase Auth, so no additional database permissions are needed beyond what's already configured in `auth_setup.sql`.

## How It Works

### Step 1: Request Reset

1. User visits `/forgot-password`
2. Enters their email address
3. `resetPassword()` function calls `supabase.auth.resetPasswordForEmail()`
4. Supabase sends an email with a secure reset link

### Step 2: Email Link

1. User receives email with reset link
2. Link contains a secure token and redirects to `/reset-password`
3. Supabase automatically handles the session creation

### Step 3: Set New Password

1. User lands on `/reset-password`
2. Page validates the session using `supabase.auth.getSession()`
3. If valid, user can enter new password
4. `updatePassword()` function calls `supabase.auth.updateUser()`
5. Password is updated and user is redirected to login

## Security Features

### 1. Secure Tokens

- Supabase generates secure, time-limited tokens
- Tokens are single-use and expire automatically
- No manual token handling required

### 2. Session Validation

- ResetPassword page validates the session before allowing password change
- Invalid or expired links show appropriate error messages
- Prevents unauthorized password changes

### 3. Password Requirements

- Minimum 6 characters
- Password confirmation required
- Client-side validation before submission

## Error Handling

### Common Issues

1. **"Invalid or expired reset link"**

   - Token has expired (default: 1 hour)
   - Link has already been used
   - User needs to request a new reset

2. **"Email not found"**

   - Email address doesn't exist in the system
   - Check spelling and try again

3. **"Password too weak"**
   - Password doesn't meet minimum requirements
   - Must be at least 6 characters

### Debug Mode

Enable console logging in development:

```typescript
// In AuthContext.tsx, add console.log statements
console.log("Auth state changed:", { user, session, isPasswordResetSession });
```

## Customization

### Email Template

Customize the password reset email in Supabase dashboard:

1. Go to Authentication > Email Templates
2. Edit "Password Reset" template
3. Use variables like `{{ .ConfirmationURL }}` for the reset link
4. Customize subject line and content

### Styling

The reset password pages use the same styling as other auth pages:

- Consistent with login/register pages
- Responsive design
- Loading states and error handling
- Success animations

## Testing

### Test the Flow

1. **Request Reset**:

   - Visit `/forgot-password`
   - Enter a valid email
   - Check for success message

2. **Email Delivery**:

   - Check inbox (and spam folder)
   - Verify email content and link

3. **Password Reset**:

   - Click the email link
   - Should redirect to `/reset-password`
   - Enter new password
   - Verify success and redirect to login

4. **Login with New Password**:
   - Try logging in with the new password
   - Should work immediately

### Test Edge Cases

- Invalid email addresses
- Expired reset links
- Multiple reset requests
- Network errors
- Browser back/forward navigation

## Troubleshooting

### Email Not Sending

1. Check Supabase email configuration
2. Verify SMTP settings
3. Check email quotas and limits
4. Test with a different email provider

### Reset Link Not Working

1. Check redirect URL configuration
2. Verify domain settings in Supabase
3. Check for typos in the URL
4. Ensure HTTPS is configured properly

### Session Issues

1. Check browser cookies and storage
2. Verify Supabase session handling
3. Test in incognito/private mode
4. Check for JavaScript errors in console

## Best Practices

1. **Rate Limiting**: Supabase handles this automatically
2. **Security Headers**: Ensure proper HTTPS configuration
3. **User Experience**: Clear error messages and loading states
4. **Accessibility**: Proper labels and keyboard navigation
5. **Mobile Responsive**: Test on various screen sizes

## Next Steps

1. **Custom Email Templates**: Brand the reset emails
2. **Additional Security**: Consider adding CAPTCHA for reset requests
3. **Analytics**: Track reset request patterns
4. **User Notifications**: Send confirmation when password is changed
5. **Session Management**: Implement proper session cleanup
