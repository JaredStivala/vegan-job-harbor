import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://synbnbuwsiazqdrxphdb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bmJuYnV3c2lhenFkcnhwaGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3MTYwNjQsImV4cCI6MjA0NzI5MjA2NH0.86TD7-cqBnzuOAmbbLLfo3dUepJUEkREsIz4OKYNuFg";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);