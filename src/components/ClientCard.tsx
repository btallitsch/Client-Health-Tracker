import { Client, ClientScore } from '../types';
import { RiskBadge } from './RiskBadge';
import { ScoreGauge } from './ScoreGauge';
import { RISK_CONFIG } from '../utils/scoring';
import { format, parseISO } from 'date-fns';
import { DollarSign, Calendar } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  score: ClientScore;
  onClick: () => void;
  animDelay?: number;
}

export function ClientCard({ client, score, onClick, animDelay = 0 }: ClientCardProps) {
  const cfg = RISK_CONFIG[score.riskLevel];

  return (
    <div
      className="animate-in"
      onClick={onClick}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid var(--border)`,
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${animDelay}ms`,
        transition: 'border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = cfg.border;
        el.style.transform = 'translateY(-2px)';
        el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3)`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = 'var(--border)';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Corner accent */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: 80, height: 80,
        background: cfg.color,
        opacity: 0.04,
        borderRadius: '0 var(--radius-lg) 0 80px',
      }} />

      {/* Header: name + badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 700, color: 'var(--text-primary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{client.name}</div>
          <div style={{
            fontSize: 12, color: 'var(--text-secondary)', marginTop: 1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{client.company}</div>
        </div>
        <RiskBadge level={score.riskLevel} size="sm" pulse={score.riskLevel !== 'healthy'} />
      </div>

      {/* Score gauge */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ScoreGauge score={score} size={100} showBreakdown={false} />
      </div>

      {/* Mini stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 8,
        paddingTop: 12,
        borderTop: '1px solid var(--border-light)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <DollarSign size={11} color="var(--score-revenue)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)' }}>
            ${(client.monthlyRevenue / 1000).toFixed(1)}k
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
          <Calendar size={11} color="var(--score-contact)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)' }}>
            {score.daysSinceContact}d ago
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{client.industry}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
          ★ {client.satisfactionRating}/10
        </div>
      </div>
    </div>
  );
}
