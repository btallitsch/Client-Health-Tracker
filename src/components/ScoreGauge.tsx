import { ClientScore } from '../types';
import { RISK_CONFIG, SCORE_BREAKDOWN } from '../utils/scoring';

interface ScoreGaugeProps {
  score: ClientScore;
  size?: number;
  showBreakdown?: boolean;
}

export function ScoreGauge({ score, size = 120, showBreakdown = false }: ScoreGaugeProps) {
  const cfg = RISK_CONFIG[score.riskLevel];
  const r = (size / 2) - 10;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const arcLen = circumference * 0.75; // 270° arc
  const fillLen = arcLen * (score.totalScore / 100);
  const rotation = 135; // start from bottom-left

  // Segment lengths
  const contactArc = arcLen * (score.contactScore / 100);
  const revenueArc = arcLen * (score.revenueScore / 100);
  const satArc = arcLen * (score.satisfactionScore / 100);
  const gap = 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: `rotate(${rotation}deg)` }}>
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={8}
            strokeDasharray={`${arcLen} ${circumference - arcLen}`}
            strokeLinecap="round"
          />

          {/* Contact segment */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={SCORE_BREAKDOWN.contact.color}
            strokeWidth={8}
            strokeDasharray={`${Math.max(0, contactArc - gap)} ${circumference - contactArc + gap}`}
            strokeDashoffset={0}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />

          {/* Revenue segment */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={SCORE_BREAKDOWN.revenue.color}
            strokeWidth={8}
            strokeDasharray={`${Math.max(0, revenueArc - gap)} ${circumference - revenueArc + gap}`}
            strokeDashoffset={-(contactArc)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />

          {/* Satisfaction segment */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={SCORE_BREAKDOWN.satisfaction.color}
            strokeWidth={8}
            strokeDasharray={`${Math.max(0, satArc - gap)} ${circumference - satArc + gap}`}
            strokeDashoffset={-(contactArc + revenueArc)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>

        {/* Center label */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: size < 90 ? 20 : 28,
            fontWeight: 600,
            color: cfg.color,
            lineHeight: 1,
          }}>{score.totalScore}</span>
          <span style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>/ 100</span>
        </div>
      </div>

      {showBreakdown && (
        <div style={{ display: 'flex', gap: 16 }}>
          {([
            { label: 'Contact', val: score.contactScore, max: 33, color: SCORE_BREAKDOWN.contact.color },
            { label: 'Revenue', val: score.revenueScore, max: 33, color: SCORE_BREAKDOWN.revenue.color },
            { label: 'Rating',  val: score.satisfactionScore, max: 34, color: SCORE_BREAKDOWN.satisfaction.color },
          ] as const).map(seg => (
            <div key={seg.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 600,
                color: seg.color,
              }}>{seg.val}<span style={{ fontSize: 10, opacity: 0.6 }}>/{seg.max}</span></div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{seg.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
