import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Radio } from "@/components/ui/radio";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { PageContainer } from "@/components/layout/page-container";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import { VotingSchedule } from "@/types/database";

const VoterVote = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user } = useRequireAuth(UserRole.VOTER);
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState<VotingSchedule | null>(null);
  const [fetchingVoting, setFetchingVoting] = useState(true);
  
  useEffect(() => {
    const fetchVotingData = async () => {
      if (!code || !user) return;
      
      try {
        // Fetch voting schedule - make sure we're using the trimmed code
        const cleanCode = code.trim().toUpperCase();
        console.log("Fetching voting data for code:", cleanCode);
        
        // First, try exact match
        let { data: votingData, error: votingError } = await supabase
          .from('voting_schedules')
          .select('*')
          .eq('code', cleanCode) // Use exact match first
          .maybeSingle();

        // If exact match fails, try case-insensitive match
        if (!votingData && (!votingError || votingError.code === 'PGRST116')) {
          console.log("No exact match found, trying case-insensitive match");
          const { data: flexData, error: flexError } = await supabase
            .from('voting_schedules')
            .select('*')
            .ilike('code', cleanCode) // Case-insensitive match as fallback
            .maybeSingle();
          
          if (flexError && flexError.code !== 'PGRST116') {
            throw flexError;
          }
          
          votingData = flexData;
        } else if (votingError && votingError.code !== 'PGRST116') {
          throw votingError;
        }
        
        if (!votingData) {
          console.error("No voting schedule found with code:", cleanCode);
          throw new Error("Voting schedule not found");
        }
        
        console.log("Voting data found:", votingData);
        setVoting(votingData);

        // Check if user already voted
        const { data: voteData, error: voteError } = await supabase
          .from('votes')
          .select('option_id')
          .eq('voting_id', votingData.id)
          .eq('voter_id', user.id)
          .maybeSingle();

        if (voteError && voteError.code !== 'PGRST116') {
          console.error("Error checking vote status:", voteError);
          throw voteError;
        }

        if (voteData) {
          setHasVoted(true);
          setSelectedOption(voteData.option_id);
          console.log("User has already voted:", voteData);
        } else {
          console.log("User has not voted yet");
        }
      } catch (error: any) {
        console.error("Error in fetchVotingData:", error);
        toast({
          title: "Error",
          description: "Failed to load voting data. Please check your voting code.",
          variant: "destructive",
        });
        // Navigate back to home if there's an error
        setTimeout(() => navigate("/voter/home"), 2000);
      } finally {
        setFetchingVoting(false);
      }
    };

    fetchVotingData();
  }, [code, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOption) {
      toast({
        title: "No option selected",
        description: "Please select an option to vote.",
        variant: "destructive",
      });
      return;
    }

    if (!voting || !user) {
      toast({
        title: "Error",
        description: "Missing voting or user information",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      console.log("Submitting vote:", {
        voting_id: voting.id,
        voter_id: user.id,
        option_id: selectedOption
      });
      
      // Submit vote
      const { error } = await supabase
        .from('votes')
        .insert({
          voting_id: voting.id,
          voter_id: user.id,
          option_id: selectedOption
        });

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - user has already voted
          throw new Error("You have already voted in this voting session.");
        }
        throw error;
      }
      
      setHasVoted(true);
      
      toast({
        title: "Vote Recorded",
        description: "Your vote has been successfully recorded!",
      });
    } catch (error: any) {
      console.error("Error submitting vote:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error submitting your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingVoting) {
    return (
      <PageContainer className="items-center justify-center text-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading voting information...</p>
        </div>
      </PageContainer>
    );
  }

  if (!voting) {
    return (
      <PageContainer className="items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold">Invalid Voting Code</h2>
          <p className="mt-2 mb-6">The voting code provided is invalid or has expired.</p>
          <Button
            onClick={() => navigate("/voter/home")}
            variant="outline"
          >
            Return Home
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate("/voter/home")}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Home
        </Button>
        
        <Logo size="sm" className="mb-6" />
        
        <h1 className="text-2xl font-bold">{voting.title}</h1>
      </div>
      
      {voting.image_url && (
        <div className="mb-6">
          <img 
            src={voting.image_url} 
            alt={voting.title} 
            className="rounded-lg w-full object-cover max-h-64"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          {voting.options.map((option) => (
            <Card 
              key={option.id}
              className={`p-4 cursor-pointer transition-colors ${
                selectedOption === option.id ? "border-votePurple bg-votePurple/5" : ""
              }`}
              onClick={() => !hasVoted && setSelectedOption(option.id)}
            >
              <div className="flex items-center gap-3">
                <Radio
                  checked={selectedOption === option.id}
                  disabled={hasVoted}
                  onChange={() => !hasVoted && setSelectedOption(option.id)}
                  className="text-votePurple"
                />
                <span>{option.text}</span>
              </div>
              {option.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={option.imageUrl}
                    alt={option.text}
                    className="rounded-md max-h-32 object-contain"
                  />
                </div>
              )}
            </Card>
          ))}
        </div>

        {hasVoted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800">
              You have already voted in this session.
            </p>
          </div>
        ) : (
          <Button 
            type="submit" 
            className="w-full bg-voteRed hover:bg-red-600"
            disabled={!selectedOption || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Vote"
            )}
          </Button>
        )}
      </form>
    </PageContainer>
  );
};

export default VoterVote;
