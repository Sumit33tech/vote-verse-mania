
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VotingOption {
  id: string;
  text: string;
  imageUrl?: string;
}

interface VotingWithResults extends VotingSchedule {
  totalVotes: number;
  results: Array<{
    optionId: string;
    text: string;
    votes: number;
  }>;
}

interface VotingSchedule {
  id: string;
  title: string;
  code: string;
  start_date: string;
  end_date: string;
  options: VotingOption[];
  image_url?: string;
}

const AdminHistory = () => {
  const { user } = useRequireAuth(UserRole.ADMIN);
  const [votings, setVotings] = useState<VotingWithResults[]>([]);
  const [selectedVoting, setSelectedVoting] = useState<VotingWithResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch completed votings
  useEffect(() => {
    if (!user) return;
    
    const fetchCompletedVotings = async () => {
      try {
        const now = new Date().toISOString();
        
        // Get all completed votings
        const { data: votingsData, error: votingsError } = await supabase
          .from('voting_schedules')
          .select('*')
          .lt('end_date', now)
          .order('end_date', { ascending: false });
          
        if (votingsError) throw votingsError;
        
        if (!votingsData || votingsData.length === 0) {
          setVotings([]);
          setIsLoading(false);
          return;
        }
        
        // For each voting, get the votes
        const votingsWithResults = await Promise.all(
          votingsData.map(async (voting) => {
            // Get all votes for this voting
            const { data: votesData, error: votesError } = await supabase
              .from('votes')
              .select('option_id')
              .eq('voting_id', voting.id);
              
            if (votesError) throw votesError;
            
            const votes = votesData || [];
            const totalVotes = votes.length;
            
            // Count votes for each option
            const voteCounts: Record<string, number> = {};
            votes.forEach(vote => {
              const optionId = vote.option_id;
              voteCounts[optionId] = (voteCounts[optionId] || 0) + 1;
            });
            
            // Format results
            const options = Array.isArray(voting.options) ? voting.options : [];
            const results = options.map(option => ({
              optionId: option.id,
              text: option.text,
              votes: voteCounts[option.id] || 0
            }));
            
            return {
              ...voting,
              totalVotes,
              results
            };
          })
        );
        
        setVotings(votingsWithResults);
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
    
    fetchCompletedVotings();
  }, [user]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWinningOption = (voting: VotingWithResults) => {
    if (!voting.results || voting.results.length === 0) return null;
    
    return voting.results.reduce((prev, current) => 
      (prev.votes > current.votes) ? prev : current
    );
  };

  if (isLoading) {
    return (
      <AdminLayout title="Voting History">
        <div className="text-center py-10">
          <p className="text-gray-500">Loading voting history...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Voting History">
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
            <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500 mt-1">
              <span>Code: <span className="font-mono">{selectedVoting.code}</span></span>
              <span>•</span>
              <span>{formatDate(selectedVoting.start_date)} - {formatDate(selectedVoting.end_date)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Total Votes</h3>
                <p className="text-3xl font-bold">{selectedVoting.totalVotes}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Winning Option</h3>
                {selectedVoting.totalVotes > 0 ? (
                  <>
                    <p className="text-xl font-bold">{getWinningOption(selectedVoting)?.text}</p>
                    <p className="text-gray-500">{getWinningOption(selectedVoting)?.votes} votes</p>
                  </>
                ) : (
                  <p className="text-gray-500">No votes recorded</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Status</h3>
                <Badge className="text-lg py-1 px-3 bg-green-500">completed</Badge>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="results">
            <TabsList className="mb-4">
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="details">Voting Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="results">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Results Breakdown</h3>
                  
                  {selectedVoting.totalVotes > 0 ? (
                    <div className="space-y-4">
                      {selectedVoting.results.map((option) => (
                        <div key={option.optionId} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{option.text}</span>
                            <span className="font-medium">
                              {option.votes} votes 
                              ({selectedVoting.totalVotes > 0 
                                ? Math.round((option.votes / selectedVoting.totalVotes) * 100) 
                                : 0}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div 
                              className="bg-votePurple h-4 rounded-full"
                              style={{ 
                                width: selectedVoting.totalVotes > 0 
                                  ? `${(option.votes / selectedVoting.totalVotes) * 100}%` 
                                  : '0%' 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No votes have been recorded for this voting.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Voting Options</h3>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Option</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead className="text-right">Votes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedVoting.options.map((option: any) => (
                        <TableRow key={option.id}>
                          <TableCell className="font-medium">{option.text}</TableCell>
                          <TableCell>
                            {option.imageUrl ? (
                              <img 
                                src={option.imageUrl} 
                                alt={option.text} 
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <span className="text-gray-400">No image</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {selectedVoting.results.find(r => r.optionId === option.id)?.votes || 0}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-500 mb-6">
            View results and statistics from past voting sessions
          </p>
          
          {votings.length > 0 ? (
            votings.map(voting => (
              <Card 
                key={voting.id}
                className="cursor-pointer hover:border-votePurple transition-colors"
                onClick={() => setSelectedVoting(voting)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{voting.title}</h3>
                      <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500 mt-1">
                        <span>Code: <span className="font-mono">{voting.code}</span></span>
                        <span>•</span>
                        <span>{formatDate(voting.end_date)}</span>
                      </div>
                    </div>
                    <Badge className="bg-green-500">{voting.totalVotes} votes</Badge>
                  </div>
                  
                  <div className="mt-3 flex justify-between text-sm">
                    <span>
                      {voting.totalVotes > 0 
                        ? `Winner: ${getWinningOption(voting)?.text}` 
                        : "No votes recorded"}
                    </span>
                    <span className="text-votePurple">View Details →</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10 border rounded-md bg-gray-50">
              <p className="text-gray-500">No completed votings found.</p>
              <p className="mt-2 text-sm text-gray-400">
                Completed votings will appear here after their end date has passed.
              </p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminHistory;
