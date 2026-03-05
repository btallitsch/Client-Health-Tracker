import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './utils/firebase';
import { useClientStore } from './store/useClientStore';
import { Dashboard } from './components/Dashboard';
import { LoginScreen } from './components/LoginScreen';
import { ClientForm } from './components/ClientForm';
import { ClientDetailModal } from './components/ClientDetailModal';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { modalMode, syncFromFirestore } = useClientStore();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Once signed in, start Firestore real-time sync
  useEffect(() => {
    if (!user) return;
    const unsubscribe = syncFromFirestore();
    return unsubscribe;
  }, [user]);

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: 13,
        fontFamily: 'var(--font-mono)',
      }}>
        Loading…
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <>
      <Dashboard />
      {(modalMode === 'add' || modalMode === 'edit') && <ClientForm />}
      {modalMode === 'view' && <ClientDetailModal />}
    </>
  );
}
