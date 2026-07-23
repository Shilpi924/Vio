import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { useUserProfileStore } from '../store/useUserProfileStore';

export function useCloudSync() {
  const profiles = useUserProfileStore((state) => state.profiles);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    void Promise.all([
      import('firebase/auth'),
      import('firebase/firestore'),
      import('../services/firebase'),
    ]).then(([{ onAuthStateChanged }, { doc, getDoc }, { auth, db }]) => {
      if (cancelled || !auth || !db) return;
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          void (async () => {
            const docRef = doc(db, 'users', currentUser.uid);
            try {
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.profiles && Object.keys(data.profiles).length > 0) {
                  useUserProfileStore.setState((state) => ({
                    profiles: { ...state.profiles, ...data.profiles },
                    hasCompletedOnboarding: true,
                  }));
                }
              }
            } catch (error) {
              console.error('Failed to fetch cloud profiles', error);
            }
          })();
        }
      });
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const timeoutId = window.setTimeout(() => {
      void Promise.all([
        import('firebase/firestore'),
        import('../services/firebase'),
      ]).then(async ([{ doc, serverTimestamp, setDoc }, { db }]) => {
        if (!db) return;
        try {
          await setDoc(doc(db, 'users', user.uid), {
            profiles,
            schemaVersion: 1,
            updatedAt: serverTimestamp(),
          }, { merge: true });
        } catch (error) {
          console.error('Failed to sync cloud profiles', error);
        }
      });
    }, 2000);
    return () => window.clearTimeout(timeoutId);
  }, [profiles, user]);
}
