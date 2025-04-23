
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Radio } from "@/components/ui/radio";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { PageContainer } from "@/components/layout/page-container";
import { Logo } from "@/components/ui/logo";
import { ArrowLeft } from "lucide-react";

// Mock data
const mockVotings = {
  "BOARD123": {
    id: "1",
    title: "Board Member Election",
    options: [
      { id: "1", text: "John Smith" },
      { id: "2", text: "Emily Johnson" },
      { id: "3", text: "Michael Brown" },
    ],
    imageUrl: "",
  },
  "BUDGET456": {
    id: "2",
    title: "Budget Approval",
    options: [
      { id: "1", text: "Approve" },
      { id: "2", text: "Reject" },
      { id: "3", text: "Abstain" },
    ],
    imageUrl: "",
  },
  "LOGO789": {
    id: "3",
    title: "New Logo Selection",
    options: [
      { id: "1", text: "Design A - Modern" },
      { id: "2", text: "Design B - Classic" },
      { id: "3", text: "Design C - Minimalist" },
    ],
    imageUrl: "https://via.placeholder.com/400x200?text=Logo+Options",
  },
};

const VoterVote = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check if user has already voted
    const checkVoted = async () => {
      // In a real app, we'd check against a database using the user's ID and voting ID
      const voted = localStorage.getItem(`voted-${code}`);
      if (voted) {
        setHasVoted(true);
        setSelectedOption(voted);
      }
    };
    
    checkVoted();
  }, [code]);

  // Get the voting data based on code
  const voting = code ? mockVotings[code as keyof typeof mockVotings] : null;

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

    setLoading(true);

    try {
      // In a real app, we'd send this to the server
      console.log("Vote submitted:", {
        votingId: voting.id,
        optionId: selectedOption,
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save vote locally for demo
      localStorage.setItem(`voted-${code}`, selectedOption);
      
      setHasVoted(true);
      
      toast({
        title: "Vote Recorded",
        description: "Your vote has been successfully recorded!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
      
      {voting.imageUrl && (
        <div className="mb-6">
          <img 
            src={voting.imageUrl} 
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
            {loading ? "Submitting..." : "Submit Vote"}
          </Button>
        )}
      </form>
    </PageContainer>
  );
};

export default VoterVote;
