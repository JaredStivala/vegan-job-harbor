export interface Job {
  id: string;
  page_title: string;
  company_name: string;
  location?: string;
  type?: string;
  salary?: string;
  date_posted?: string;
  tags?: string[];
  url: string;
  description?: string;
}