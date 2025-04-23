
// Custom type definitions for Supabase tables
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          contact: string | null;
          role: string;
          aadhar_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          contact?: string | null;
          role: string;
          aadhar_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          contact?: string | null;
          role?: string;
          aadhar_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      voting_schedules: {
        Row: {
          id: string;
          code: string;
          title: string;
          start_date: string;
          end_date: string;
          options: any[];
          image_url: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          title: string;
          start_date: string;
          end_date: string;
          options: any[];
          image_url?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          title?: string;
          start_date?: string;
          end_date?: string;
          options?: any[];
          image_url?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          voting_id: string;
          voter_id: string;
          option_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          voting_id: string;
          voter_id: string;
          option_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          voting_id?: string;
          voter_id?: string;
          option_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_voter_history: {
        Args: { voter_uuid: string };
        Returns: {
          voting_id: string;
          code: string;
          title: string;
          start_date: string;
          end_date: string;
          options: any[];
          image_url: string | null;
          selected_option_id: string;
          is_active: boolean;
          results: Array<{
            option_id: string;
            option_text: string;
            vote_count: number;
          }> | null;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Extend the Database type to be used in the client
export type CustomDatabase = Database;
