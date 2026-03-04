import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useClientStore } from '../store/useClientStore';
import { RISK_CONFIG } from '../utils/scoring';

export function RiskChart() {
  const { stats, clients, scores } = useClientStore();

  const pieData = [
    { name: 'Healthy',  value: stats.healthyCount,  color: RISK_CONFIG.healthy.color  },
    { name: 'At Risk',  value: stats.atRiskCount,   color: RISK_CONFIG['at-risk'].color },
    { name: 'Critical', value: stats.criticalCount, color: RISK_CONFIG.critical.color },
  ].filter(d => d.value > 0);

  // Revenue by risk level
  const revenueData = [
    { name: 'Healthy',  revenue: 0, color: RISK_CONFIG.healthy.color  },
    { name: 'At Risk',  revenue: 0, color: RISK_CONFIG['at-risk'].color },
    { name: 'Critical', revenue: 0, color: RISK_CONFIG.critical.color },
  ];
  clients.forEach(c => {
    const s = scores.get(c.id);
    if (!s) return;
    const idx = s.riskLevel === 'healthy' ? 0 : s.riskLevel === 'at-risk' ? 1 : 2;
    revenueData[idx].revenue += c.monthlyRevenue;
  });

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        padding: '8px 12px',
        fontSize: 12,
      }}>
        <div style={{ color: payload[0].payload.color, fontWeight: 600 }}>{payload[0].name}</div>
        <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {typeof payload[0].value === 'number' && payload[0].value > 999
            ? `$${(payload[0].value / 1000).toFixed(1)}k`
            : payload[0].value} {payload[0].value <= 999 ? 'clients' : '/ mo'}
        </div>
      </div>
    );
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--text-secondary)',
    marginBottom: 12,
  };

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
    }}>
      {/* Donut */}
      <div style={{ padding: '20px 24px', borderRight: '1px solid var(--border)' }}>
        <div style={sectionLabel}>Risk Distribution</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 120, height: 120, flexShrink: 0 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={32} outerRadius={52}
                  dataKey="value" paddingAngle={3} strokeWidth={0}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Healthy',  val: stats.healthyCount,  color: RISK_CONFIG.healthy.color  },
              { label: 'At Risk',  val: stats.atRiskCount,   color: RISK_CONFIG['at-risk'].color },
              { label: 'Critical', val: stats.criticalCount, color: RISK_CONFIG.critical.color },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, marginLeft: 'auto', paddingLeft: 12 }}>
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by risk */}
      <div style={{ padding: '20px 24px' }}>
        <div style={sectionLabel}>Revenue by Risk</div>
        <div style={{ height: 120 }}>
          <ResponsiveContainer>
            <BarChart data={revenueData} barSize={28}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-ui)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} width={42} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {revenueData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
