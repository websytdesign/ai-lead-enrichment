'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddLeadFormProps {
  onAdd: (lead: { contact_name: string; company_name: string; email: string; website: string }) => Promise<void>;
}

export function AddLeadForm({ onAdd }: AddLeadFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ contact_name: '', company_name: '', email: '', website: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onAdd(form);
    setForm({ contact_name: '', company_name: '', email: '', website: '' });
    setLoading(false);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" />
        Add Lead
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">Contact Name</label>
        <input
          type="text"
          required
          value={form.contact_name}
          onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
          className="w-full px-3 py-2 border rounded text-sm"
          placeholder="John Smith"
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
        <input
          type="text"
          required
          value={form.company_name}
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          className="w-full px-3 py-2 border rounded text-sm"
          placeholder="Acme Corp"
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3 py-2 border rounded text-sm"
          placeholder="john@acme.com"
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-600 mb-1">Website</label>
        <input
          type="url"
          required
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          className="w-full px-3 py-2 border rounded text-sm"
          placeholder="https://acme.com"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add'}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
      >
        Cancel
      </button>
    </form>
  );
}
