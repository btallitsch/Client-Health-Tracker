import { differenceInDays, parseISO } from 'date-fns';
import { Client, ClientScore, RiskLevel } from '../types';

// --- Contact Score (0–33 pts) ---
export function calcContactScore(lastContactDate: string): { score: number; daysSinceContact: number } {
  const days = differenceInDays(new Date(), parseISO(lastContactDate));
  let score: number;

  if (days <= 7)       score = 33;
  else if (days <= 14) score = 28;
  else if (days <= 30) score = 18;
  else if (days <= 60) score = 8;
  else if (days <= 90) score = 3;
  else                 score = 0;

  return { score, daysSinceContact: days };
}

// --- Revenue Score (0–33 pts) ---
// Tiered scoring based on monthly revenue
export function calcRevenueScore(revenue: number): number {
  if (revenue >= 20000) return 33;
  if (revenue >= 10000) return 28;
  if (revenue >= 5000)  return 22;
  if (revenue >= 2500)  return 16;
  if (revenue >= 1000)  return 10;
  if (revenue >= 500)   return 5;
  return 2;
}

// --- Satisfaction Score (0–34 pts) ---
// Rating 1-10 mapped to 0-34
export function calcSatisfactionScore(rating: number): number {
  const clamped = Math.min(10, Math.max(1, rating));
  return Math.round(((clamped - 1) / 9) * 34);
}

// --- Risk level from total score ---
export function getRiskLevel(totalScore: number): RiskLevel {
  if (totalScore >= 70) return 'healthy';
  if (totalScore >= 40) return 'at-risk';
  return 'critical';
}

// --- Full score for one client ---
export function scoreClient(client: Client): ClientScore {
  const { score: contactScore, daysSinceContact } = calcContactScore(client.lastContactDate);
  const revenueScore = calcRevenueScore(client.monthlyRevenue);
  const satisfactionScore = calcSatisfactionScore(client.satisfactionRating);
  const totalScore = contactScore + revenueScore + satisfactionScore;
  const riskLevel = getRiskLevel(totalScore);

  return {
    clientId: client.id,
    contactScore,
    revenueScore,
    satisfactionScore,
    totalScore,
    riskLevel,
    daysSinceContact,
  };
}

// --- Score all clients ---
export function scoreAllClients(clients: Client[]): Map<string, ClientScore> {
  const map = new Map<string, ClientScore>();
  clients.forEach(c => map.set(c.id, scoreClient(c)));
  return map;
}

// --- Score breakdown labels ---
export const SCORE_BREAKDOWN = {
  contact: { label: 'Last Contact', max: 33, color: '#60a5fa' },
  revenue: { label: 'Revenue',      max: 33, color: '#a78bfa' },
  satisfaction: { label: 'Satisfaction', max: 34, color: '#34d399' },
};

export const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string; border: string }> = {
  healthy:  { label: 'Healthy',  color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)'  },
  'at-risk': { label: 'At Risk', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.3)'  },
  critical: { label: 'Critical', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
};
