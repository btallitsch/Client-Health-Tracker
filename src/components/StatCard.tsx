import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  accent?: string;
  delay?: number;
}

export function StatCard({ label, value, sub, icon, accent = 'var(--accent)', delay = 0 }: StatCardProps) {
  return (
    <div
      className="animate-in"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${delay}ms`,
        transition: 'border-color var(--transition), transform var(--transition)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = accent + '40';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Subtle glow */}
      <div style={{
        position: 'absolute',
        top: -20,
        right: -20,
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: accent,
        opacity: 0.06,
        filter: 'blur(20px)',
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
        }}>{label}</span>
        <span style={{
          color: accent,
          display: 'flex',
          alignItems: 'center',
          opacity: 0.9,
        }}>{icon}</span>
      </div>

      <div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 28,
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1,
        }}>{value}</div>
        {sub && (
          <div style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            marginTop: 4,
          }}>{sub}</div>
        )}
      </div>
    </div>
  );
}
