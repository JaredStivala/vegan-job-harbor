export interface Job {
  id: string;
  page_title: string | null;
  company_name: string | null;
  location: string | null;
  type?: string;
  salary: string | null;
  date_posted: string | null;
  date_closes: string | null;
  tags: string[] | null;
  url: string;
  description: string | null;
  updated_at: string | null;
  logo?: string | null;
}