import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { Activity } from 'lucide-react';

export function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      setError('Sign in failed. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '48px 40px',
        width: '100%',
        maxWidth: 380,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        animation: 'slideUp 0.3s ease both',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48,
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={22} color="#fff" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em' }}>
              Client Health
            </div>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 2,
            }}>Tracker</div>
          </div>
        </div>

        <p style={{
          fontSize: 13, color: 'var(--text-secondary)',
          textAlign: 'center', lineHeight: 1.6,
        }}>
          Sign in to access your client dashboard and sync data across devices.
        </p>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? 'var(--bg-raised)' : '#fff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: '#111',
            padding: '11px 16px',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'opacity var(--transition)',
          }}
        >
          {/* Google SVG icon */}
          <svg width="16" height="16" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.5 5C9.6 39.6 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.6 5.8l6.2 5.2C40.7 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>

        {error && (
          <p style={{ fontSize: 12, color: 'var(--critical)', textAlign: 'center' }}>{error}</p>
        )}

        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
          Your data is stored privately in your account and never shared.
        </p>
      </div>
    </div>
  );
}
