import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wezoidktbfaedlskmdrn.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlem9pZGt0YmZhZWRsc2ttZHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4Nzg2MzAsImV4cCI6MjA3MjQ1NDYzMH0.EI324TO36B6veGw6a2yhCnkKYe_-fdmMfguq3CAGu1M';

export const supabase = createClient(supabaseUrl, supabaseKey);
