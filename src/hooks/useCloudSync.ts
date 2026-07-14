import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import type { User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useUserProfileStore } from '../store/useUserProfileStore';

export function useCloudSync() {
  const profiles = useUserProfileStore((state) => state.profiles);
  const [user, setUser] = useState<User | null>(auth?.currentUser ?? null);

  useEffect(() => {
    if (!auth || !db) return;

    const firestore = db;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const fetchProfiles = async () => {
          try {
            const docRef = doc(firestore, 'users', currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.profiles && Object.keys(data.profiles).length > 0) {
                useUserProfileStore.setState((state) => ({
                  profiles: { ...state.profiles, ...data.profiles },
                  hasCompletedOnboarding: true
                }));
              }
            }
          } catch (e) {
            console.error('Failed to fetch cloud profiles', e);
          }
        };
        fetchProfiles();
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user && db) {
      const firestore = db;
      const syncToCloud = async () => {
        try {
          const docRef = doc(firestore, 'users', user.uid);
          await setDoc(docRef, {
            profiles,
            schemaVersion: 1,
            updatedAt: serverTimestamp(),
          }, { merge: true });
        } catch (e) {
          console.error('Failed to sync to cloud', e);
        }
      };
      
      const timeoutId = setTimeout(syncToCloud, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [profiles, user]);
}
