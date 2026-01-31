import {
    User,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    type Auth,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { db, auth as firebaseAuth } from '@/lib/firebase';

const auth: Auth = firebaseAuth;

export type UserRole = 'admin' | 'user';

type AuthContextValue = {
  user: User | null;
  role: UserRole | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const ADMIN_EMAILS = ['admin@example.com'];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeEmail(email?: string | null) {
  return (email ?? '').trim().toLowerCase();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setRole(null);
        setInitializing(false);
        return;
      }

      const email = normalizeEmail(firebaseUser.email);
      const isAdminEmail = ADMIN_EMAILS.includes(email);
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        const assignedRole: UserRole = isAdminEmail ? 'admin' : 'user';
        await setDoc(userRef, {
          email,
          role: assignedRole,
          createdAt: serverTimestamp(),
        });
        setRole(assignedRole);
        setInitializing(false);
        return;
      }

      const data = snap.data();
      let resolvedRole: UserRole = data?.role === 'admin' ? 'admin' : 'user';

      if (isAdminEmail && resolvedRole !== 'admin') {
        await updateDoc(userRef, { role: 'admin' });
        resolvedRole = 'admin';
      }

      setRole(resolvedRole);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      initializing,
      login: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
      },
      register: async (email: string, password: string) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const emailValue = normalizeEmail(result.user.email);
        const isAdminEmail = ADMIN_EMAILS.includes(emailValue);
        await setDoc(doc(db, 'users', result.user.uid), {
          email: emailValue,
          role: isAdminEmail ? 'admin' : 'user',
          createdAt: serverTimestamp(),
        });
      },
      logout: async () => {
        await signOut(auth);
      },
    }),
    [user, role, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
