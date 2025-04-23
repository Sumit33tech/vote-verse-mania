
import { useEffect, useState } from "react";
import { VoterLayout } from "@/components/layout/voter-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const VoterHome = () => {
  const navigate = useNavigate();
  const [votingCode, setVotingCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [activeVotings, setActiveVotings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Protect this route
  const { user } = useRequireAuth(UserRole.VOTER);

  // Fetch active votings when the component mounts
  useEffect(() => {
    const fetchActiveVotings = async () => {
      if (!user) return;

      try {
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('voting_schedules')
          .select('id, code, title, start_date, end_date')
          .lte('start_date', now)
          .gte('end_date', now)
          .order('end_date', { ascending: true });
          
        if (error) throw error;
        
        setActiveVotings(data || []);
      } catch (error: any) {
        console.error("Error fetching active votings:", error);
        toast({
          title: "Error",
          description: "Failed to load active votings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchActiveVotings();
  }, [user]);

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
      // Clean up the voting code - remove whitespace and convert to uppercase
      const cleanCode = votingCode.trim().toUpperCase();
      console.log("Checking voting code:", cleanCode);
      
      // Check if the code exists and if the voting is active
      // Instead of using ilike, directly compare with lowercase values for more flexibility
      const { data, error } = await supabase
        .from('voting_schedules')
        .select('id, title, start_date, end_date')
        .eq('code', cleanCode) // Use direct equality for exact matches
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Error checking voting code:", error);
        throw new Error("Error checking voting code. Please try again.");
      }
      
      if (!data) {
        // Try a second more flexible search if the exact match failed
        const { data: flexData, error: flexError } = await supabase
          .from('voting_schedules')
          .select('id, title, start_date, end_date')
          .ilike('code', cleanCode) // Case-insensitive match as fallback
          .maybeSingle();
          
        if (flexError || !flexData) {
          console.log("No voting found with code (using flexible matching):", cleanCode);
          throw new Error("No voting found with that code. Please check and try again.");
        }
        
        // Use the data from the flexible search
        data = flexData;
      }
      
      console.log("Voting found:", data);
      
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
      navigate(`/voter/vote/${cleanCode}`);
    } catch (error: any) {
      console.error("Vote join error:", error);
      toast({
        title: "Invalid code",
        description: error.message || "The voting code you entered is invalid.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Join a voting directly by clicking on an active voting card
  const handleJoinVoting = (code: string) => {
    navigate(`/voter/vote/${code}`);
  };

  return (
    <VoterLayout title="Vote Mania">
      <div className="flex flex-col items-center justify-center space-y-8 mt-6">
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
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : "Join Voting"}
            </Button>
          </form>
        </div>
        
        {loading ? (
          <div className="w-full max-w-2xl mt-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Loading active votings...</p>
          </div>
        ) : activeVotings.length > 0 ? (
          <div className="w-full max-w-2xl mt-8">
            <h3 className="text-xl font-semibold mb-4">Active Votings</h3>
            <div className="space-y-4">
              {activeVotings.map((voting) => (
                <Card 
                  key={voting.id} 
                  className="cursor-pointer hover:border-voteRed"
                  onClick={() => handleJoinVoting(voting.code)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{voting.title}</h4>
                        <p className="text-sm text-gray-500">
                          Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{voting.code}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Ends: {new Date(voting.end_date).toLocaleString()}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-voteRed hover:bg-red-600"
                      >
                        Join Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl mt-8 text-center">
            <p className="text-gray-500">No active votings are available at the moment.</p>
            <p className="text-sm text-gray-400 mt-1">Check back later or enter a voting code above.</p>
          </div>
        )}
      </div>
    </VoterLayout>
  );
};

export default VoterHome;
