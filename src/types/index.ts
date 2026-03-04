export type RiskLevel = 'healthy' | 'at-risk' | 'critical';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  industry: string;
  lastContactDate: string; // ISO date string
  monthlyRevenue: number;
  satisfactionRating: number; // 1-10
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientScore {
  clientId: string;
  contactScore: number;   // 0-33
  revenueScore: number;   // 0-33
  satisfactionScore: number; // 0-34
  totalScore: number;     // 0-100
  riskLevel: RiskLevel;
  daysSinceContact: number;
}

export interface DashboardStats {
  totalClients: number;
  healthyCount: number;
  atRiskCount: number;
  criticalCount: number;
  totalRevenue: number;
  avgHealthScore: number;
}

export type SortField = 'name' | 'totalScore' | 'lastContactDate' | 'monthlyRevenue' | 'satisfactionRating';
export type SortDirection = 'asc' | 'desc';
export type FilterRisk = 'all' | RiskLevel;

export interface FilterState {
  riskFilter: FilterRisk;
  searchQuery: string;
  sortField: SortField;
  sortDirection: SortDirection;
}

export type ModalMode = 'add' | 'edit' | 'view' | null;

export interface ClientFormData {
  name: string;
  company: string;
  email: string;
  industry: string;
  lastContactDate: string;
  monthlyRevenue: number;
  satisfactionRating: number;
  notes: string;
}
