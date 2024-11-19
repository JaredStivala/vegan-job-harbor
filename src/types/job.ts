export interface Job {
  id: string;
  page_title: string;
  company_name: string;
  location?: string | null;
  type?: string;
  salary?: string | null;
  date_posted?: string | null;
  date_closes?: string | null;
  tags?: string[] | null;
  url: string;
  description?: string | null;
  updated_at?: string | null;
}