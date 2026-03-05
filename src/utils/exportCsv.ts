import { format, parseISO } from 'date-fns';
import { Client, ClientScore } from '../types';

export function exportToCsv(clients: Client[], scores: Map<string, ClientScore>) {
  const headers = [
    'Name', 'Company', 'Email', 'Industry',
    'Last Contact', 'Days Since Contact', 'Monthly Revenue ($)',
    'Satisfaction (1-10)', 'Health Score', 'Risk Level',
    'Contact Score', 'Revenue Score', 'Satisfaction Score', 'Notes'
  ];

  const rows = clients.map(c => {
    const s = scores.get(c.id);
    return [
      c.name,
      c.company,
      c.email,
      c.industry,
      format(parseISO(c.lastContactDate), 'yyyy-MM-dd'),
      s?.daysSinceContact ?? '',
      c.monthlyRevenue,
      c.satisfactionRating,
      s?.totalScore ?? '',
      s?.riskLevel ?? '',
      s?.contactScore ?? '',
      s?.revenueScore ?? '',
      s?.satisfactionScore ?? '',
      `"${c.notes.replace(/"/g, '""')}"`, // escape quotes in notes
    ];
  });

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `client-health-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
