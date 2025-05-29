'use server'

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection('users').doc(uid).get();

    if(userRecord.exists) {
      return {
        success: false,
        message: 'User already exists. Please sign in instead.'
      }
    }

    await db.collection('users').doc(uid).set({
      name, email
    })

      return {
        success: true,
        message: 'Account created successfully. Please sign in.'
      }

  } catch (error: any) {
    console.error('Error during sign up:', error);

    if(error.code === 'auth/email-already-exist') {
      return {
        success: false,
        message: 'Email already exists. Please use a different email address.'
      };
    }

    return {
      success: false,
      message: 'An unexpected error occurred during sign up. Please try again later.'
    }
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if(!userRecord) {
      return {
        success: false,
        message: 'User does not exist. Create an account instead.'
      }
    }

    await setSessionCookie(idToken);
  } catch (error) {
    console.error('Error during sign in:', error);

    return {
      success: false,
      message: 'An unexpected error occurred during sign in. Please try again later.'
    }
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000 // 7 days
  })

  cookieStore.set('session', sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  })
}