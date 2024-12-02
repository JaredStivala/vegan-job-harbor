export interface Job {
  id: string;
  url: string;
  page_title: string | null;
  company_name: string | null;
  location: string | null;
  salary: string | null;
  description: string | null;
  tags: string[] | null;
  date_posted: string | null;
  date_closes: string | null;
  updated_at: string | null;
  logo: string | null;
  colored?: boolean;
}