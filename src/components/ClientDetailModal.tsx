import { X, Mail, Building2, Briefcase, Calendar, DollarSign, Trash2, Pencil } from 'lucide-react';
import { useClientStore } from '../store/useClientStore';
import { RiskBadge } from './RiskBadge';
import { ScoreGauge } from './ScoreGauge';
import { format, parseISO } from 'date-fns';
import { SCORE_BREAKDOWN } from '../utils/scoring';

export function ClientDetailModal() {
  const { getSelectedClient, getClientScore, openModal, closeModal, deleteClient } = useClientStore();
  const client = getSelectedClient();
  const score = client ? getClientScore(client.id) : undefined;

  if (!client || !score) return null;

  function handleDelete() {
    if (client && confirm(`Remove ${client.name}?`)) {
      deleteClient(client.id);
    }
  }

  const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span style={{ color: 'var(--text-muted)', marginTop: 1 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: 16,
    }} onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 480,
        maxHeight: '90vh', overflow: 'auto',
        animation: 'slideUp 0.25s ease both',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{client.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{client.company}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <RiskBadge level={score.riskLevel} pulse />
            <button onClick={closeModal} style={{
              background: 'var(--bg-raised)', border: '1px solid var(--border)', borderRadius: 6,
              color: 'var(--text-secondary)', width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><X size={14} /></button>
          </div>
        </div>

        {/* Score section */}
        <div style={{
          padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(to bottom, var(--bg-raised), transparent)',
        }}>
          <ScoreGauge score={score} size={140} showBreakdown />
        </div>

        {/* Score bar chart */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 12 }}>Score Breakdown</div>
          {[
            { label: 'Last Contact', val: score.contactScore, max: 33, color: SCORE_BREAKDOWN.contact.color },
            { label: 'Revenue',      val: score.revenueScore, max: 33, color: SCORE_BREAKDOWN.revenue.color },
            { label: 'Satisfaction', val: score.satisfactionScore, max: 34, color: SCORE_BREAKDOWN.satisfaction.color },
          ].map(seg => (
            <div key={seg.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{seg.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: seg.color }}>
                  {seg.val}<span style={{ color: 'var(--text-muted)' }}>/{seg.max}</span>
                </span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${(seg.val / seg.max) * 100}%`,
                  background: seg.color, borderRadius: 2,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Details */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14, borderBottom: '1px solid var(--border)' }}>
          <Row icon={<Mail size={13} />} label="Email" value={client.email} />
          <Row icon={<Building2 size={13} />} label="Industry" value={client.industry} />
          <Row icon={<Calendar size={13} />} label="Last Contact"
            value={`${format(parseISO(client.lastContactDate), 'MMM d, yyyy')} (${score.daysSinceContact}d ago)`} />
          <Row icon={<DollarSign size={13} />} label="Monthly Revenue"
            value={`$${client.monthlyRevenue.toLocaleString()}`} />
          <Row icon={<Briefcase size={13} />} label="Satisfaction"
            value={`${client.satisfactionRating}/10`} />
        </div>

        {/* Notes */}
        {client.notes && (
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 }}>Notes</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{client.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, padding: '16px 24px', justifyContent: 'flex-end' }}>
          <button onClick={handleDelete} style={{
            background: 'var(--critical-bg)', border: '1px solid var(--critical-border)',
            borderRadius: 'var(--radius-sm)', color: 'var(--critical)',
            padding: '8px 14px', fontSize: 12, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <Trash2 size={12} /> Delete
          </button>
          <button onClick={() => openModal('edit', client.id)} style={{
            background: 'var(--accent)', border: 'none',
            borderRadius: 'var(--radius-sm)', color: '#fff',
            padding: '8px 16px', fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <Pencil size={12} /> Edit Client
          </button>
        </div>
      </div>
    </div>
  );
}
