
import { VotingOption } from "@/lib/types";

export interface VotingWithResults {
  id: string;
  title: string;
  code: string;
  start_date: string;
  end_date: string;
  options: VotingOption[];
  image_url?: string;
  totalVotes: number;
  results: Array<{
    optionId: string;
    text: string;
    votes: number;
  }>;
  status: 'upcoming' | 'active' | 'completed';
}

export interface VotingDetailsProps {
  voting: VotingWithResults;
  onBack: () => void;
}
