```javascript
import supabase from '../lib/supabase';
import { getUserByEmail, createUser } from './userService';

// This is a mock auth service, in a real app you would use Supabase Auth
export const signIn = async (email, password) => {
  try {
    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real app, you'd verify the password with Supabase Auth
    // For now, we'll just return the user
    return {
      user,
      session: {
        access_token: 'mock_token',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      }
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signUp = async (email, password, userData) => {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create user in our users table
    const user = await createUser({
      email,
      ...userData,
      role: userData.role || 'admin' // Default to admin for signup
    });

    return {
      user,
      session: {
        access_token: 'mock_token',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      }
    };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const signOut = async () => {
  // In a real app, you'd call supabase.auth.signOut()
  return { success: true };
};

// For test credentials
export const getTestUsers = () => {
  return [
    {
      email: 'admin@recruitpro.com',
      password: 'admin123',
      role: 'admin',
      name: 'John Admin'
    },
    {
      email: 'recruiter@recruitpro.com',
      password: 'recruiter123',
      role: 'recruiter',
      name: 'Jane Recruiter'
    },
    {
      email: 'hr@recruitpro.com',
      password: 'hr123',
      role: 'hr',
      name: 'Bob HR Manager'
    }
  ];
};
```