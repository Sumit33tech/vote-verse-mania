
import { VoterLayout } from "@/components/layout/voter-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const VoterHome = () => {
  const navigate = useNavigate();
  const [votingCode, setVotingCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!votingCode) {
      toast({
        title: "Missing code",
        description: "Please enter a voting code.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we'd validate this against the database
    if (votingCode === "BOARD123" || votingCode === "BUDGET456" || votingCode === "LOGO789") {
      console.log("Entered voting with code:", votingCode);
      navigate(`/voter/vote/${votingCode}`);
    } else {
      toast({
        title: "Invalid code",
        description: "The voting code you entered doesn't exist or has expired.",
        variant: "destructive",
      });
    }
  };

  return (
    <VoterLayout title="Vote Mania">
      <div className="flex flex-col items-center justify-center space-y-8 mt-12">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Enter a Voting Code</h2>
          <p className="text-gray-600 mb-6">
            Enter the voting code provided by the administrator to participate in a voting session.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={votingCode}
              onChange={(e) => setVotingCode(e.target.value.toUpperCase())}
              placeholder="e.g., BOARD123"
              className="text-center text-xl font-mono tracking-wider uppercase"
              maxLength={10}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-voteRed hover:bg-red-600"
            >
              Join Voting
            </Button>
          </form>
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Need help? Contact the voting administrator.</p>
        </div>
      </div>
    </VoterLayout>
  );
};

export default VoterHome;
