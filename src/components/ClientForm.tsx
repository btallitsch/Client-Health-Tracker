import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useClientStore } from '../store/useClientStore';
import { ClientFormData } from '../types';
import { formatISO } from 'date-fns';

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Design', 'Consulting',
  'Media', 'Retail', 'Construction', 'Education', 'Legal', 'Marketing', 'Other',
];

const EMPTY_FORM: ClientFormData = {
  name: '',
  company: '',
  email: '',
  industry: 'Technology',
  lastContactDate: formatISO(new Date(), { representation: 'date' }),
  monthlyRevenue: 0,
  satisfactionRating: 7,
  notes: '',
};

export function ClientForm() {
  const { modalMode, getSelectedClient, addClient, updateClient, closeModal } = useClientStore();
  const existing = getSelectedClient();
  const isEdit = modalMode === 'edit';
  const title = isEdit ? 'Edit Client' : 'Add Client';

  const [form, setForm] = useState<ClientFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({});

  useEffect(() => {
    if (isEdit && existing) {
      setForm({
        name: existing.name,
        company: existing.company,
        email: existing.email,
        industry: existing.industry,
        lastContactDate: existing.lastContactDate,
        monthlyRevenue: existing.monthlyRevenue,
        satisfactionRating: existing.satisfactionRating,
        notes: existing.notes,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [modalMode, existing]);

  function set<K extends keyof ClientFormData>(key: K, val: ClientFormData[K]) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof ClientFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.company.trim()) newErrors.company = 'Company is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.lastContactDate) newErrors.lastContactDate = 'Date is required';
    if (form.monthlyRevenue < 0) newErrors.monthlyRevenue = 'Must be ≥ 0';
    if (form.satisfactionRating < 1 || form.satisfactionRating > 10) newErrors.satisfactionRating = '1–10';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    if (isEdit && existing) updateClient(existing.id, form);
    else addClient(form);
  }

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    background: 'var(--bg-base)',
    border: `1px solid ${hasError ? 'var(--critical)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    padding: '9px 12px',
    fontSize: 13,
    transition: 'border-color var(--transition)',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    marginBottom: 5,
  };

  const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 0 };
  const errorStyle: React.CSSProperties = { fontSize: 11, color: 'var(--critical)', marginTop: 3 };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 16,
    }}
      onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div
        className="animate-in"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'slideUp 0.25s ease both',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</span>
          <button
            onClick={closeModal}
            style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--text-secondary)',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background var(--transition)',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Row: Name + Company */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Name</label>
              <input style={inputStyle(!!errors.name)} value={form.name}
                onChange={e => set('name', e.target.value)} placeholder="Full name" />
              {errors.name && <span style={errorStyle}>{errors.name}</span>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Company</label>
              <input style={inputStyle(!!errors.company)} value={form.company}
                onChange={e => set('company', e.target.value)} placeholder="Company name" />
              {errors.company && <span style={errorStyle}>{errors.company}</span>}
            </div>
          </div>

          {/* Row: Email + Industry */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle(!!errors.email)} value={form.email}
                onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
              {errors.email && <span style={errorStyle}>{errors.email}</span>}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Industry</label>
              <select style={{ ...inputStyle(), appearance: 'none' }} value={form.industry}
                onChange={e => set('industry', e.target.value)}>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          {/* Last Contact Date */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Last Contact Date</label>
            <input type="date" style={inputStyle(!!errors.lastContactDate)} value={form.lastContactDate}
              onChange={e => set('lastContactDate', e.target.value)} />
            {errors.lastContactDate && <span style={errorStyle}>{errors.lastContactDate}</span>}
          </div>

          {/* Monthly Revenue */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Monthly Revenue (USD)</label>
            <input type="number" min={0} style={inputStyle(!!errors.monthlyRevenue)}
              value={form.monthlyRevenue}
              onChange={e => set('monthlyRevenue', Number(e.target.value))}
              placeholder="5000" />
            {errors.monthlyRevenue && <span style={errorStyle}>{errors.monthlyRevenue}</span>}
          </div>

          {/* Satisfaction Rating */}
          <div style={fieldStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Satisfaction Rating</label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 600, color: 'var(--healthy)' }}>
                {form.satisfactionRating}<span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>/10</span>
              </span>
            </div>
            <input type="range" min={1} max={10} step={1}
              value={form.satisfactionRating}
              onChange={e => set('satisfactionRating', Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--healthy)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>1 — Very Unhappy</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>10 — Delighted</span>
            </div>
            {errors.satisfactionRating && <span style={errorStyle}>{errors.satisfactionRating}</span>}
          </div>

          {/* Notes */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Notes</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Any context, warnings, or opportunities..."
              rows={3}
              style={{
                ...inputStyle(),
                resize: 'vertical',
                lineHeight: 1.5,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          gap: 10,
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          justifyContent: 'flex-end',
        }}>
          <button onClick={closeModal} style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            transition: 'background var(--transition)',
          }}>Cancel</button>
          <button onClick={handleSubmit} style={{
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            color: '#fff',
            padding: '8px 20px',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.02em',
            transition: 'opacity var(--transition)',
          }}>{isEdit ? 'Save Changes' : 'Add Client'}</button>
        </div>
      </div>
    </div>
  );
}
