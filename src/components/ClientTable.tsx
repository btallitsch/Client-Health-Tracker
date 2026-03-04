import { Client, ClientScore, SortField, SortDirection } from '../types';
import { RiskBadge } from './RiskBadge';
import { useClientStore } from '../store/useClientStore';
import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { SCORE_BREAKDOWN } from '../utils/scoring';

interface ClientTableProps {
  clients: Client[];
}

const COLUMNS: { key: SortField; label: string }[] = [
  { key: 'name',             label: 'Client'       },
  { key: 'totalScore',       label: 'Health'       },
  { key: 'lastContactDate',  label: 'Last Contact' },
  { key: 'monthlyRevenue',   label: 'Revenue'      },
  { key: 'satisfactionRating', label: 'Rating'     },
];

function MiniBar({ val, max, color }: { val: number; max: number; color: string }) {
  return (
    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ width: `${(val / max) * 100}%`, height: '100%', background: color, borderRadius: 2 }} />
    </div>
  );
}

export function ClientTable({ clients }: ClientTableProps) {
  const { getClientScore, openModal, filter, setFilter } = useClientStore();

  function handleSort(field: SortField) {
    if (filter.sortField === field) {
      setFilter({ sortDirection: filter.sortDirection === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilter({ sortField: field, sortDirection: field === 'totalScore' ? 'asc' : 'desc' });
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (filter.sortField !== field) return <ArrowUpDown size={11} opacity={0.4} />;
    return filter.sortDirection === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />;
  }

  const thStyle: React.CSSProperties = {
    padding: '10px 14px',
    textAlign: 'left',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px 14px',
    borderTop: '1px solid var(--border-light)',
    verticalAlign: 'middle',
  };

  if (clients.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
        No clients match the current filters.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
        <thead>
          <tr style={{ background: 'var(--bg-raised)' }}>
            {COLUMNS.map(col => (
              <th key={col.key} style={thStyle} onClick={() => handleSort(col.key)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {col.label}
                  <SortIcon field={col.key} />
                </div>
              </th>
            ))}
            <th style={{ ...thStyle, cursor: 'default' }}>Risk</th>
            <th style={{ ...thStyle, cursor: 'default' }}></th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, i) => {
            const score = getClientScore(client.id);
            if (!score) return null;

            return (
              <tr
                key={client.id}
                className="animate-in"
                style={{
                  animationDelay: `${i * 30}ms`,
                  transition: 'background var(--transition)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                onClick={() => openModal('view', client.id)}
              >
                {/* Name */}
                <td style={tdStyle}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{client.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{client.company}</div>
                </td>

                {/* Score */}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 140 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600, minWidth: 24 }}>
                      {score.totalScore}
                    </span>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', gap: 2 }}>
                        <MiniBar val={score.contactScore} max={33} color={SCORE_BREAKDOWN.contact.color} />
                        <MiniBar val={score.revenueScore} max={33} color={SCORE_BREAKDOWN.revenue.color} />
                        <MiniBar val={score.satisfactionScore} max={34} color={SCORE_BREAKDOWN.satisfaction.color} />
                      </div>
                    </div>
                  </div>
                </td>

                {/* Last Contact */}
                <td style={tdStyle}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    {format(parseISO(client.lastContactDate), 'MMM d, yyyy')}
                  </div>
                  <div style={{ fontSize: 11, color: score.daysSinceContact > 30 ? 'var(--critical)' : 'var(--text-muted)', marginTop: 1 }}>
                    {score.daysSinceContact}d ago
                  </div>
                </td>

                {/* Revenue */}
                <td style={tdStyle}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                    ${client.monthlyRevenue.toLocaleString()}
                  </span>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>/ mo</div>
                </td>

                {/* Satisfaction */}
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600 }}>
                      {client.satisfactionRating}
                    </span>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: 10 }, (_, j) => (
                        <div key={j} style={{
                          width: 4, height: 10, borderRadius: 1,
                          background: j < client.satisfactionRating
                            ? (client.satisfactionRating >= 7 ? 'var(--healthy)' : client.satisfactionRating >= 4 ? 'var(--at-risk)' : 'var(--critical)')
                            : 'rgba(255,255,255,0.08)',
                        }} />
                      ))}
                    </div>
                  </div>
                </td>

                {/* Risk */}
                <td style={tdStyle}>
                  <RiskBadge level={score.riskLevel} size="sm" />
                </td>

                {/* Action */}
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <button
                    onClick={e => { e.stopPropagation(); openModal('view', client.id); }}
                    style={{
                      background: 'var(--bg-raised)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      color: 'var(--text-secondary)',
                      padding: '5px 8px',
                      display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11,
                    }}
                  >
                    <Eye size={11} /> View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
