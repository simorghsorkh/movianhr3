'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FEATURES, type FeatureKey } from '@/lib/features';

type UserAccess = Record<FeatureKey, boolean>;
type AccessMap  = Record<string, UserAccess>;

interface FeatureAccessContextType {
  /** Check whether a user has access to a feature (default: true) */
  hasAccess: (userId: string, key: FeatureKey) => boolean;
  /** Get the full access map for a user */
  getUserAccess: (userId: string) => UserAccess;
  /** Toggle a single feature for a user */
  setFeatureAccess: (userId: string, key: FeatureKey, enabled: boolean) => void;
  /** Enable or disable ALL features for a user at once */
  setAllAccess: (userId: string, enabled: boolean) => void;
}

const FeatureAccessContext = createContext<FeatureAccessContextType | null>(null);

/** All features enabled by default */
const DEFAULT_ACCESS = Object.fromEntries(
  FEATURES.map((f) => [f.key, true])
) as UserAccess;

export function FeatureAccessProvider({ children }: { children: React.ReactNode }) {
  const [accessMap, setAccessMap] = useState<AccessMap>({});

  // Hydrate from localStorage once on client
  useEffect(() => {
    try {
      const stored = localStorage.getItem('movian_feature_access');
      if (stored) setAccessMap(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (map: AccessMap) => {
    setAccessMap(map);
    try { localStorage.setItem('movian_feature_access', JSON.stringify(map)); } catch {}
  };

  const getUserAccess = (userId: string): UserAccess => ({
    ...DEFAULT_ACCESS,
    ...(accessMap[userId] ?? {}),
  });

  const hasAccess = (userId: string, key: FeatureKey) =>
    getUserAccess(userId)[key] ?? true;

  const setFeatureAccess = (userId: string, key: FeatureKey, enabled: boolean) => {
    const current = getUserAccess(userId);
    persist({ ...accessMap, [userId]: { ...current, [key]: enabled } });
  };

  const setAllAccess = (userId: string, enabled: boolean) => {
    const all = Object.fromEntries(FEATURES.map((f) => [f.key, enabled])) as UserAccess;
    persist({ ...accessMap, [userId]: all });
  };

  return (
    <FeatureAccessContext.Provider value={{ hasAccess, getUserAccess, setFeatureAccess, setAllAccess }}>
      {children}
    </FeatureAccessContext.Provider>
  );
}

export function useFeatureAccess() {
  const ctx = useContext(FeatureAccessContext);
  if (!ctx) throw new Error('useFeatureAccess must be used inside FeatureAccessProvider');
  return ctx;
}
