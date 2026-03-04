import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client, ClientScore, DashboardStats, FilterState, ModalMode, ClientFormData } from '../types';
import { scoreAllClients } from '../utils/scoring';
import { SAMPLE_CLIENTS } from '../utils/sampleData';
import { formatISO } from 'date-fns';

interface ClientStore {
  clients: Client[];
  scores: Map<string, ClientScore>;
  filter: FilterState;
  modalMode: ModalMode;
  selectedClientId: string | null;
  stats: DashboardStats;
  addClient: (data: ClientFormData) => void;
  updateClient: (id: string, data: ClientFormData) => void;
  deleteClient: (id: string) => void;
  setFilter: (patch: Partial<FilterState>) => void;
  openModal: (mode: ModalMode, clientId?: string) => void;
  closeModal: () => void;
  getFilteredClients: () => Client[];
  getClientScore: (id: string) => ClientScore | undefined;
  getSelectedClient: () => Client | undefined;
}

function computeStats(clients: Client[], scores: Map<string, ClientScore>): DashboardStats {
  let healthy = 0, atRisk = 0, critical = 0, totalRevenue = 0, scoreSum = 0;
  clients.forEach(c => {
    totalRevenue += c.monthlyRevenue;
    const s = scores.get(c.id);
    if (s) {
      scoreSum += s.totalScore;
      if (s.riskLevel === 'healthy') healthy++;
      else if (s.riskLevel === 'at-risk') atRisk++;
      else critical++;
    }
  });
  return {
    totalClients: clients.length,
    healthyCount: healthy,
    atRiskCount: atRisk,
    criticalCount: critical,
    totalRevenue,
    avgHealthScore: clients.length > 0 ? Math.round(scoreSum / clients.length) : 0,
  };
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const initialScores = scoreAllClients(SAMPLE_CLIENTS);

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: SAMPLE_CLIENTS,
      scores: initialScores,
      filter: {
        riskFilter: 'all',
        searchQuery: '',
        sortField: 'totalScore',
        sortDirection: 'asc',
      },
      modalMode: null,
      selectedClientId: null,
      stats: computeStats(SAMPLE_CLIENTS, initialScores),

      addClient: (data) => {
        const now = formatISO(new Date(), { representation: 'date' });
        const newClient: Client = { ...data, id: generateId(), createdAt: now, updatedAt: now };
        const clients = [...get().clients, newClient];
        const scores = scoreAllClients(clients);
        set({ clients, scores, stats: computeStats(clients, scores), modalMode: null });
      },

      updateClient: (id, data) => {
        const now = formatISO(new Date(), { representation: 'date' });
        const clients = get().clients.map(c => c.id === id ? { ...c, ...data, updatedAt: now } : c);
        const scores = scoreAllClients(clients);
        set({ clients, scores, stats: computeStats(clients, scores), modalMode: null, selectedClientId: null });
      },

      deleteClient: (id) => {
        const clients = get().clients.filter(c => c.id !== id);
        const scores = scoreAllClients(clients);
        set({ clients, scores, stats: computeStats(clients, scores), modalMode: null, selectedClientId: null });
      },

      setFilter: (patch) => set(state => ({ filter: { ...state.filter, ...patch } })),
      openModal: (mode, clientId) => set({ modalMode: mode, selectedClientId: clientId ?? null }),
      closeModal: () => set({ modalMode: null, selectedClientId: null }),

      getFilteredClients: () => {
        const { clients, scores, filter } = get();
        let filtered = [...clients];
        if (filter.riskFilter !== 'all') {
          filtered = filtered.filter(c => scores.get(c.id)?.riskLevel === filter.riskFilter);
        }
        if (filter.searchQuery.trim()) {
          const q = filter.searchQuery.toLowerCase();
          filtered = filtered.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.company.toLowerCase().includes(q) ||
            c.industry.toLowerCase().includes(q)
          );
        }
        filtered.sort((a, b) => {
          let valA: number | string, valB: number | string;
          if (filter.sortField === 'totalScore') { valA = scores.get(a.id)?.totalScore ?? 0; valB = scores.get(b.id)?.totalScore ?? 0; }
          else if (filter.sortField === 'name') { valA = a.name; valB = b.name; }
          else if (filter.sortField === 'lastContactDate') { valA = a.lastContactDate; valB = b.lastContactDate; }
          else if (filter.sortField === 'monthlyRevenue') { valA = a.monthlyRevenue; valB = b.monthlyRevenue; }
          else { valA = a.satisfactionRating; valB = b.satisfactionRating; }
          if (valA < valB) return filter.sortDirection === 'asc' ? -1 : 1;
          if (valA > valB) return filter.sortDirection === 'asc' ? 1 : -1;
          return 0;
        });
        return filtered;
      },

      getClientScore: (id) => get().scores.get(id),
      getSelectedClient: () => {
        const { clients, selectedClientId } = get();
        return clients.find(c => c.id === selectedClientId);
      },
    }),
    {
      name: 'client-health-tracker',
      partialize: (state) => ({ clients: state.clients }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const scores = scoreAllClients(state.clients);
          state.scores = scores;
          state.stats = computeStats(state.clients, scores);
        }
      },
    }
  )
);
