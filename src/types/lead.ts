export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  contact_name: string;
  company_name: string;
  email: string;
  website: string;
  status: 'pending' | 'processing' | 'ready' | 'needs_review' | 'approved' | 'sent' | 'failed';
  scraped_content: string | null;
  company_summary: string | null;
  industry: string | null;
  target_audience: string | null;
  service_type: string | null;
  confidence_score: number | null;
  pain_point_1: string | null;
  pain_point_2: string | null;
  pain_point_3: string | null;
  supporting_evidence: string | null;
  email_subject: string | null;
  email_body: string | null;
  personalization_note: string | null;
  error_message: string | null;
}
