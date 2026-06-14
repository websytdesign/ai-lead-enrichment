'use client';

import { Lead } from '@/types/lead';
import { StatusBadge } from './StatusBadge';
import { RefreshCw } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onRowClick: (lead: Lead) => void;
  onProcess: (id: string) => void;
  processingIds: Set<string>;
}

export function LeadsTable({
  leads,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onRowClick,
  onProcess,
  processingIds,
}: LeadsTableProps) {
  const allSelected = leads.length > 0 && selectedIds.size === leads.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={allSelected ? onDeselectAll : onSelectAll}
                className="rounded"
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(lead.id)}
                  onChange={() => onToggleSelect(lead.id)}
                  className="rounded"
                />
              </td>
              <td className="px-4 py-3" onClick={() => onRowClick(lead)}>
                <div className="text-sm font-medium text-gray-900">{lead.contact_name}</div>
                <div className="text-xs text-gray-500">{lead.email}</div>
              </td>
              <td className="px-4 py-3" onClick={() => onRowClick(lead)}>
                <div className="text-sm text-gray-900">{lead.company_name}</div>
                <div className="text-xs text-gray-500 truncate max-w-[200px]">{lead.website}</div>
              </td>
              <td className="px-4 py-3" onClick={() => onRowClick(lead)}>
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-3" onClick={() => onRowClick(lead)}>
                {lead.confidence_score ? (
                  <span className={`text-sm font-medium ${lead.confidence_score >= 70 ? 'text-green-600' : lead.confidence_score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {lead.confidence_score}%
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                {(lead.status === 'pending' || lead.status === 'failed') && (
                  <button
                    onClick={() => onProcess(lead.id)}
                    disabled={processingIds.has(lead.id)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${processingIds.has(lead.id) ? 'animate-spin' : ''}`} />
                    {processingIds.has(lead.id) ? 'Processing...' : lead.status === 'failed' ? 'Reprocess' : 'Process'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {leads.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No leads yet. Add your first lead above.
        </div>
      )}
    </div>
  );
}
