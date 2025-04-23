import { useState } from "react";
import { VoterLayout } from "@/components/layout/voter-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";

const VoterHome = () => {
  const navigate = useNavigate();
  const [votingCode, setVotingCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  
  // Protect this route
  useRequireAuth(UserRole.VOTER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!votingCode) {
      toast({
        title: "Missing code",
        description: "Please enter a voting code.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);

    try {
      // Check if the code exists and if the voting is active
      const { data, error } = await supabase
        .from('voting_schedules')
        .select('id, title, start_date, end_date')
        .eq('code', votingCode)
        .single();
      
      if (error) {
        throw new Error("The voting code you entered doesn't exist.");
      }
      
      if (!data) {
        throw new Error("No voting found with that code.");
      }
      
      const now = new Date();
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      
      if (now < startDate) {
        throw new Error("This voting hasn't started yet. It will begin on " + startDate.toLocaleString());
      }
      
      if (now > endDate) {
        throw new Error("This voting has already ended. It closed on " + endDate.toLocaleString());
      }
      
      // Navigate to voting page if code exists and voting is active
      navigate(`/voter/vote/${votingCode}`);
    } catch (error: any) {
      toast({
        title: "Invalid code",
        description: error.message || "The voting code you entered is invalid.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
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
              disabled={isChecking}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-voteRed hover:bg-red-600"
              disabled={isChecking}
            >
              {isChecking ? "Checking..." : "Join Voting"}
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
