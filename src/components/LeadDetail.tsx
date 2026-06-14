'use client';

import { useState } from 'react';
import { Lead } from '@/types/lead';
import { StatusBadge } from './StatusBadge';
import { X, Building2, Target, AlertTriangle, Mail, Brain, FileText, Copy, Send, Pencil, Check } from 'lucide-react';

interface LeadDetailProps {
  lead: Lead;
  onClose: () => void;
  onApprove: (id: string) => void;
  onSend: (id: string) => void;
  onUpdateDraft: (id: string, subject: string, body: string) => Promise<void>;
}

export function LeadDetail({ lead, onClose, onApprove, onSend, onUpdateDraft }: LeadDetailProps) {
  const [editing, setEditing] = useState(false);
  const [editSubject, setEditSubject] = useState(lead.email_subject || '');
  const [editBody, setEditBody] = useState(lead.email_body || '');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSaveDraft = async () => {
    setSaving(true);
    await onUpdateDraft(lead.id, editSubject, editBody);
    setEditing(false);
    setSaving(false);
  };

  const handleCopyEmail = () => {
    const text = `Subject: ${lead.email_subject}\n\n${lead.email_body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    const mailto = `mailto:${lead.email}?subject=${encodeURIComponent(lead.email_subject || '')}&body=${encodeURIComponent(lead.email_body || '')}`;
    window.open(mailto);
    onSend(lead.id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{lead.contact_name}</h2>
              <p className="text-gray-600">{lead.company_name}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={lead.status} />
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Company Analysis */}
          {lead.company_summary && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Company Analysis</h3>
              </div>
              <p className="text-sm text-blue-800">{lead.company_summary}</p>
              <div className="mt-2 flex gap-4 text-xs text-blue-600">
                {lead.industry && <span>Industry: {lead.industry}</span>}
                {lead.target_audience && <span>Audience: {lead.target_audience}</span>}
              </div>
            </div>
          )}

          {/* Pain Points */}
          {lead.pain_point_1 && (
            <div className="mb-4 p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-amber-600" />
                <h3 className="font-semibold text-amber-900">Pain Points</h3>
              </div>
              <ul className="space-y-1 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-3 h-3 mt-1 text-amber-500" />
                  {lead.pain_point_1}
                </li>
                {lead.pain_point_2 && (
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 mt-1 text-amber-500" />
                    {lead.pain_point_2}
                  </li>
                )}
                {lead.pain_point_3 && (
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 mt-1 text-amber-500" />
                    {lead.pain_point_3}
                  </li>
                )}
              </ul>
              {lead.supporting_evidence && (
                <p className="mt-2 text-xs text-amber-600">{lead.supporting_evidence}</p>
              )}
            </div>
          )}

          {/* Email Draft */}
          {lead.email_subject && (
            <div className="mb-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-green-600" />
                <h3 className="font-semibold text-green-900">Email Draft</h3>
                {lead.confidence_score && (
                  <span className="ml-auto text-xs text-green-600">
                    Confidence: {lead.confidence_score}%
                  </span>
                )}
              </div>
              {editing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editSubject}
                    onChange={(e) => setEditSubject(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-sm"
                  />
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border rounded text-sm font-mono"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveDraft}
                      disabled={saving}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-green-800 mb-2">
                    Subject: {lead.email_subject}
                  </p>
                  <p className="text-sm text-green-800 whitespace-pre-line">
                    {lead.email_body}
                  </p>
                </>
              )}
            </div>
          )}

          {/* Personalization Note */}
          {lead.personalization_note && (
            <div className="mb-4 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-4 h-4 text-purple-600" />
                <h3 className="font-semibold text-purple-900 text-sm">AI Strategy Note</h3>
              </div>
              <p className="text-xs text-purple-700">{lead.personalization_note}</p>
            </div>
          )}

          {/* Error */}
          {lead.error_message && (
            <div className="mb-4 p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-red-600" />
                <h3 className="font-semibold text-red-900 text-sm">Error</h3>
              </div>
              <p className="text-xs text-red-700">{lead.error_message}</p>
            </div>
          )}

          {/* Actions */}
          {(lead.status === 'ready' || lead.status === 'needs_review' || lead.status === 'approved') && (
            <div className="flex items-center gap-2 pt-4 border-t">
              {lead.status !== 'approved' && (
                <button
                  onClick={() => onApprove(lead.id)}
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </button>
              )}
              {!editing && (
                <button
                  onClick={() => {
                    setEditSubject(lead.email_subject || '');
                    setEditBody(lead.email_body || '');
                    setEditing(true);
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Draft
                </button>
              )}
              <button
                onClick={handleSendEmail}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
                Send Email
              </button>
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1 px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}

          {/* Sent state */}
          {lead.status === 'sent' && (
            <div className="flex items-center gap-3 pt-4 border-t">
              <span className="text-sm text-green-600 font-medium">✓ Email sent</span>
              <button
                onClick={() => onApprove(lead.id)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Undo — didn&apos;t send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
