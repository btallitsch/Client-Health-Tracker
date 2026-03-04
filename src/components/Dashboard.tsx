import { useState } from 'react';
import {
  Users, TrendingUp, AlertTriangle, CheckCircle2,
  XCircle, Search, Plus, LayoutGrid, List, Activity
} from 'lucide-react';
import { useClientStore } from '../store/useClientStore';
import { StatCard } from './StatCard';
import { ClientCard } from './ClientCard';
import { ClientTable } from './ClientTable';
import { RiskChart } from './RiskChart';
import { FilterRisk } from '../types';

type ViewMode = 'grid' | 'table';

const RISK_FILTERS: { value: FilterRisk; label: string }[] = [
  { value: 'all',      label: 'All Clients' },
  { value: 'critical', label: 'Critical'    },
  { value: 'at-risk',  label: 'At Risk'     },
  { value: 'healthy',  label: 'Healthy'     },
];

export function Dashboard() {
  const { stats, filter, setFilter, openModal, getFilteredClients, getClientScore } = useClientStore();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredClients = getFilteredClients();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>

      {/* Top Nav */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        height: 56,
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{
            width: 28, height: 28,
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Activity size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>
            Client Health
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--text-muted)',
            background: 'var(--bg-raised)', border: '1px solid var(--border)',
            borderRadius: 4, padding: '2px 6px',
          }}>Tracker</span>
        </div>

        <button
          onClick={() => openModal('add')}
          style={{
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            color: '#fff',
            padding: '7px 14px',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.02em',
            display: 'flex', alignItems: 'center', gap: 5,
            transition: 'opacity var(--transition)',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <Plus size={13} /> Add Client
        </button>
      </header>

      <main style={{ flex: 1, padding: '24px', maxWidth: 1400, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          <StatCard label="Total Clients" value={stats.totalClients}
            icon={<Users size={15} />} accent="var(--accent)" delay={0}
            sub="Tracked accounts" />
          <StatCard label="Avg Health Score" value={stats.avgHealthScore}
            icon={<TrendingUp size={15} />} accent="var(--score-contact)" delay={60}
            sub="Out of 100" />
          <StatCard label="Healthy" value={stats.healthyCount}
            icon={<CheckCircle2 size={15} />} accent="var(--healthy)" delay={120}
            sub={`${stats.totalClients > 0 ? Math.round((stats.healthyCount / stats.totalClients) * 100) : 0}% of clients`} />
          <StatCard label="At Risk" value={stats.atRiskCount}
            icon={<AlertTriangle size={15} />} accent="var(--at-risk)" delay={180}
            sub="Needs attention" />
          <StatCard label="Critical" value={stats.criticalCount}
            icon={<XCircle size={15} />} accent="var(--critical)" delay={240}
            sub="Immediate action" />
          <StatCard label="Total Revenue" value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`}
            icon={<TrendingUp size={15} />} accent="var(--score-revenue)" delay={300}
            sub="Monthly recurring" />
        </div>

        {/* Charts panel */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease both',
          animationDelay: '200ms',
        }}>
          <div style={{
            padding: '14px 24px',
            borderBottom: '1px solid var(--border)',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--text-secondary)',
          }}>Risk Overview</div>
          <RiskChart />
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              placeholder="Search by name, company, or industry…"
              value={filter.searchQuery}
              onChange={e => setFilter({ searchQuery: e.target.value })}
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                padding: '8px 12px 8px 32px',
                fontSize: 13,
              }}
            />
          </div>

          {/* Risk filter pills */}
          <div style={{ display: 'flex', gap: 6 }}>
            {RISK_FILTERS.map(rf => {
              const active = filter.riskFilter === rf.value;
              const colorMap: Record<string, string> = {
                all: 'var(--accent)', critical: 'var(--critical)',
                'at-risk': 'var(--at-risk)', healthy: 'var(--healthy)',
              };
              const c = colorMap[rf.value];
              return (
                <button
                  key={rf.value}
                  onClick={() => setFilter({ riskFilter: rf.value })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    border: active ? `1px solid ${c}40` : '1px solid var(--border)',
                    background: active ? `${c}15` : 'var(--bg-card)',
                    color: active ? c : 'var(--text-secondary)',
                    transition: 'all var(--transition)',
                    cursor: 'pointer',
                  }}
                >{rf.label}</button>
              );
            })}
          </div>

          {/* View toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            {([['grid', LayoutGrid], ['table', List]] as const).map(([mode, Icon]) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  width: 34, height: 34,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: viewMode === mode ? 'var(--bg-raised)' : 'transparent',
                  color: viewMode === mode ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: 'none',
                  transition: 'background var(--transition)',
                }}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: -12 }}>
          {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} shown
        </div>

        {/* Client display */}
        {viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}>
            {filteredClients.map((client, i) => {
              const score = getClientScore(client.id);
              if (!score) return null;
              return (
                <ClientCard
                  key={client.id}
                  client={client}
                  score={score}
                  onClick={() => openModal('view', client.id)}
                  animDelay={i * 40}
                />
              );
            })}
            {filteredClients.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
                No clients match the current filters.
              </div>
            )}
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}>
            <ClientTable clients={filteredClients} />
          </div>
        )}
      </main>
    </div>
  );
}
