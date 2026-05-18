'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserRole } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: (User & { password: string })[] = [
  {
    id: 'js-demo',
    name: 'Sara Ahmadi',
    email: 'seeker@movian.io',
    password: 'demo123',
    role: 'job-seeker',
    avatar: 'https://ui-avatars.com/api/?name=Sara+Ahmadi&background=6175f5&color=fff',
    location: 'Tehran, Iran',
    bio: 'Marketing professional seeking career growth.',
    createdAt: '2024-01-15',
  },
  {
    id: 'mentor-demo',
    name: 'Dr. Leila Hosseini',
    email: 'mentor@movian.io',
    password: 'demo123',
    role: 'mentor',
    avatar: 'https://ui-avatars.com/api/?name=Leila+Hosseini&background=f97316&color=fff',
    location: 'Tehran, Iran',
    bio: 'Career coach and HR expert.',
    createdAt: '2023-11-10',
    approvalStatus: 'approved',
  },
  {
    id: 'trainer-demo',
    name: 'Kamran Nasiri',
    email: 'trainer@movian.io',
    password: 'demo123',
    role: 'trainer',
    avatar: 'https://ui-avatars.com/api/?name=Kamran+Nasiri&background=8b5cf6&color=fff',
    location: 'Tehran, Iran',
    bio: 'Digital marketing trainer.',
    createdAt: '2023-10-15',
    approvalStatus: 'approved',
  },
  {
    id: 'admin-demo',
    name: 'Admin',
    email: 'admin@movian.io',
    password: 'demo123',
    role: 'admin',
    createdAt: '2023-01-01',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('movian-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('movian-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('movian-user', JSON.stringify(userData));
      return true;
    }
    const stored = localStorage.getItem('movian-registered-users');
    if (stored) {
      const registeredUsers = JSON.parse(stored) as (User & { password: string })[];
      const reg = registeredUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (reg) {
        const { password: _, ...userData } = reg;
        setUser(userData);
        localStorage.setItem('movian-user', JSON.stringify(userData));
        return true;
      }
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const allUsers = [
      ...DEMO_USERS,
      ...JSON.parse(localStorage.getItem('movian-registered-users') || '[]'),
    ];
    if (allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return false;
    }
    const newUser: User & { password: string } = {
      id: generateId(),
      name,
      email,
      password,
      role: 'job-seeker',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const registered = JSON.parse(localStorage.getItem('movian-registered-users') || '[]');
    registered.push(newUser);
    localStorage.setItem('movian-registered-users', JSON.stringify(registered));

    const { password: _, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem('movian-user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('movian-user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('movian-user', JSON.stringify(updated));
  };

  const setRole = (role: UserRole) => {
    updateUser({ role });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
