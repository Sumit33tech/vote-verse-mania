import { useState, useEffect } from "react";
import { VoterLayout } from "@/components/layout/voter-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { VotingHistory } from "@/types/database";

const VoterHistory = () => {
  const [selectedVoting, setSelectedVoting] = useState<VotingHistory | null>(null);
  const [votingHistory, setVotingHistory] = useState<VotingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Protect this route
  const { user } = useRequireAuth(UserRole.VOTER);

  useEffect(() => {
    const fetchVotingHistory = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .rpc('get_voter_history', { voter_uuid: user.id });

        if (error) {
          throw error;
        }

        setVotingHistory(data || []);
      } catch (error: any) {
        console.error("Error fetching voting history:", error);
        toast({
          title: "Error",
          description: "Failed to load voting history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVotingHistory();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSelectedOptionText = (voting: VotingHistory) => {
    const option = voting.options.find((opt: any) => opt.id === voting.selected_option_id);
    return option ? option.text : "Unknown option";
  };

  const getWinningOption = (voting: VotingHistory) => {
    if (!voting.results || voting.results.length === 0) return null;
    
    return voting.results.reduce((prev, current) => 
      (prev.vote_count > current.vote_count) ? prev : current
    );
  };

  if (isLoading) {
    return (
      <VoterLayout title="My Voting History">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </VoterLayout>
    );
  }

  return (
    <VoterLayout title="My Voting History">
      {selectedVoting ? (
        <div>
          <button
            onClick={() => setSelectedVoting(null)}
            className="mb-4 text-votePurple hover:underline flex items-center"
          >
            ← Back to history
          </button>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold">{selectedVoting.title}</h2>
            <p className="text-gray-500 mt-1">
              Voted on {formatDate(selectedVoting.start_date)}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Your Vote</h3>
                <p className="text-xl font-bold text-votePurple">
                  {getSelectedOptionText(selectedVoting)}
                </p>
              </CardContent>
            </Card>
            
            {!selectedVoting.is_active && selectedVoting.results && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-2">Final Result</h3>
                  <p className="text-xl font-bold">
                    {getWinningOption(selectedVoting)?.option_text || "No results yet"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {!selectedVoting.is_active && selectedVoting.results && (
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Total votes: {selectedVoting.results.reduce((sum, opt) => sum + opt.vote_count, 0)}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-500 mb-6">
            View your past voting history and results
          </p>
          
          {votingHistory.length > 0 ? (
            votingHistory.map((voting) => (
              <Card 
                key={voting.voting_id}
                className="cursor-pointer hover:border-votePurple transition-colors"
                onClick={() => setSelectedVoting(voting)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{voting.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(voting.start_date)}
                      </p>
                    </div>
                    <Badge className={voting.is_active ? "bg-yellow-500" : "bg-green-500"}>
                      {voting.is_active ? "In Progress" : "Completed"}
                    </Badge>
                  </div>
                  
                  <div className="mt-3 flex justify-between text-sm">
                    <span>You voted: <span className="font-medium text-votePurple">
                      {getSelectedOptionText(voting)}
                    </span></span>
                    <span className="text-votePurple">View Details →</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">You haven't participated in any voting sessions yet.</p>
            </div>
          )}
        </div>
      )}
    </VoterLayout>
  );
};

export default VoterHistory;
