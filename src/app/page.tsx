'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lead } from '@/types/lead';
import { LeadsTable } from '@/components/LeadsTable';
import { LeadDetail } from '@/components/LeadDetail';
import { AddLeadForm } from '@/components/AddLeadForm';
import { Zap, Trash2 } from 'lucide-react';

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchLeads = useCallback(async () => {
    const res = await fetch('/api/leads');
    const data = await res.json();
    setLeads(data);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const addLead = async (lead: { contact_name: string; company_name: string; email: string; website: string }) => {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    fetchLeads();
  };

  const processLead = async (id: string) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    await fetch(`/api/leads/${id}/process`, { method: 'POST' });
    setProcessingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    fetchLeads();
  };

  const approveLead = async (id: string) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' }),
    });
    const updated = await res.json();
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
    if (selectedLead?.id === id) setSelectedLead(updated);
  };

  const sendLead = async (id: string) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'sent' }),
    });
    const updated = await res.json();
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
    if (selectedLead?.id === id) setSelectedLead(updated);
  };

  const updateDraft = async (id: string, subject: string, body: string) => {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_subject: subject, email_body: body }),
    });
    const updated = await res.json();
    setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
    if (selectedLead?.id === id) setSelectedLead(updated);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(leads.map((l) => l.id)));
  const deselectAll = () => setSelectedIds(new Set());

  const bulkProcess = async () => {
    const pendingIds = leads
      .filter((l) => selectedIds.has(l.id) && (l.status === 'pending' || l.status === 'failed'))
      .map((l) => l.id);

    if (pendingIds.length === 0) return;

    for (const id of pendingIds) {
      setProcessingIds((prev) => new Set(prev).add(id));
    }

    await fetch('/api/leads/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: pendingIds }),
    });

    setProcessingIds(new Set());
    setSelectedIds(new Set());
    fetchLeads();
  };

  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} lead(s)?`)) return;

    await fetch('/api/leads/bulk', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selectedIds) }),
    });

    setSelectedIds(new Set());
    fetchLeads();
  };

  const processAll = async () => {
    const pendingIds = leads
      .filter((l) => l.status === 'pending' || l.status === 'failed')
      .map((l) => l.id);

    if (pendingIds.length === 0) return;

    for (const id of pendingIds) {
      setProcessingIds((prev) => new Set(prev).add(id));
    }

    await fetch('/api/leads/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: pendingIds }),
    });

    setProcessingIds(new Set());
    fetchLeads();
  };

  const pendingCount = leads.filter((l) => l.status === 'pending' || l.status === 'failed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Lead Enrichment</h1>
          <p className="text-gray-600 mt-1">
            Scrape → Analyze → Generate Personalized Outreach
          </p>
        </div>

        {/* Add Lead + Toolbar */}
        <div className="mb-6 flex items-center justify-between">
          <AddLeadForm onAdd={addLead} />
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <>
                <span className="text-sm text-gray-500">{selectedIds.size} selected</span>
                <button
                  onClick={bulkProcess}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  <Zap className="w-4 h-4" />
                  Process Selected
                </button>
                <button
                  onClick={bulkDelete}
                  className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
            {pendingCount > 0 && selectedIds.size === 0 && (
              <button
                onClick={processAll}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                <Zap className="w-4 h-4" />
                Process All ({pendingCount})
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border">
          <LeadsTable
            leads={leads}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onRowClick={setSelectedLead}
            onProcess={processLead}
            processingIds={processingIds}
          />
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
            <div className="text-sm text-gray-500">Total Leads</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {leads.filter((l) => l.status === 'ready' || l.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-500">Ready</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-indigo-600">
              {leads.filter((l) => l.status === 'sent').length}
            </div>
            <div className="text-sm text-gray-500">Sent</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-red-600">
              {leads.filter((l) => l.status === 'failed').length}
            </div>
            <div className="text-sm text-gray-500">Failed</div>
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onApprove={approveLead}
          onSend={sendLead}
          onUpdateDraft={updateDraft}
        />
      )}
    </div>
  );
}
