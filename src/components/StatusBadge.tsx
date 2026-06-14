'use client';

import { cn } from '@/lib/utils';
import { Lead } from '@/types/lead';

const statusConfig: Record<Lead['status'], { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-gray-100 text-gray-700' },
  processing: { label: 'Processing', className: 'bg-blue-100 text-blue-700 animate-pulse' },
  ready: { label: 'Ready', className: 'bg-green-100 text-green-700' },
  needs_review: { label: 'Needs Review', className: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Approved', className: 'bg-purple-100 text-purple-700' },
  sent: { label: 'Sent', className: 'bg-indigo-100 text-indigo-700' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-700' },
};

export function StatusBadge({ status }: { status: Lead['status'] }) {
  const config = statusConfig[status];
  return (
    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', config.className)}>
      {config.label}
    </span>
  );
}
