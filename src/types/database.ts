
import { Database as SupabaseDatabase } from "@/integrations/supabase/types";
import { UserRole } from "@/lib/types";

// Extending the Supabase database types with our custom tables
export interface Profile {
  id: string;
  name: string;
  email: string;
  contact?: string;
  role: UserRole;
  aadhar_number?: string;
  created_at: string;
  updated_at: string;
}

export interface VotingSchedule {
  id: string;
  code: string;
  title: string;
  start_date: string;
  end_date: string;
  options: any[];
  image_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Vote {
  id: string;
  voting_id: string;
  voter_id: string;
  option_id: string;
  created_at: string;
}

export interface VotingResult {
  option_id: string;
  option_text: string;
  vote_count: number;
}
