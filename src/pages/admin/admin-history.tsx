
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { VotingList } from "@/components/admin/voting-list";
import { VotingDetailsPanel } from "@/components/admin/voting-details-panel";
import { VotingWithResults } from "@/types/voting";

const AdminHistory = () => {
  const { user } = useRequireAuth(UserRole.ADMIN);
  const [votings, setVotings] = useState<VotingWithResults[]>([]);
  const [selectedVoting, setSelectedVoting] = useState<VotingWithResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  useEffect(() => {
    if (!user) return;
    
    const fetchAllVotings = async () => {
      try {
        const { data: votingsData, error: votingsError } = await supabase
          .from('voting_schedules')
          .select('*')
          .order('start_date', { ascending: false });
          
        if (votingsError) throw votingsError;
        
        if (!votingsData || votingsData.length === 0) {
          setVotings([]);
          setIsLoading(false);
          return;
        }
        
        const votingsWithResults = await Promise.all(
          votingsData.map(async (voting) => {
            const { data: votesData, error: votesError } = await supabase
              .from('votes')
              .select('option_id')
              .eq('voting_id', voting.id);
              
            if (votesError) throw votesError;
            
            const votes = votesData || [];
            const totalVotes = votes.length;
            
            const voteCounts: Record<string, number> = {};
            votes.forEach(vote => {
              const optionId = vote.option_id;
              voteCounts[optionId] = (voteCounts[optionId] || 0) + 1;
            });
            
            const options = Array.isArray(voting.options) ? voting.options : [];
            const results = options.map(option => ({
              optionId: option.id,
              text: option.text,
              votes: voteCounts[option.id] || 0
            }));
            
            const now = new Date();
            const startDate = new Date(voting.start_date);
            const endDate = new Date(voting.end_date);
            
            let status: 'upcoming' | 'active' | 'completed';
            if (now < startDate) {
              status = 'upcoming';
            } else if (now <= endDate) {
              status = 'active';
            } else {
              status = 'completed';
            }
            
            return {
              ...voting,
              totalVotes,
              results,
              status
            };
          })
        );
        
        setVotings(votingsWithResults);
        
        if (selectedVoting) {
          const updatedSelectedVoting = votingsWithResults.find(voting => voting.id === selectedVoting.id);
          if (updatedSelectedVoting) {
            setSelectedVoting(updatedSelectedVoting);
          }
        }
      } catch (error: any) {
        console.error("Error fetching voting data:", error);
        toast({
          title: "Error",
          description: "Failed to load voting data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllVotings();
    
    const votesChannel = supabase
      .channel('admin-votes-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'votes' 
        }, 
        () => {
          console.log('Votes changed, refreshing data');
          fetchAllVotings();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(votesChannel);
    };
  }, [user, selectedVoting?.id]);

  const filteredVotings = votings.filter(voting => {
    if (activeTab === "all") return true;
    return voting.status === activeTab;
  });

  if (isLoading) {
    return (
      <AdminLayout title="Voting Dashboard">
        <div className="text-center py-10">
          <p className="text-gray-500">Loading voting data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Voting Dashboard">
      {selectedVoting ? (
        <VotingDetailsPanel 
          voting={selectedVoting}
          onBack={() => setSelectedVoting(null)}
        />
      ) : (
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <VotingList 
            votings={filteredVotings}
            onSelectVoting={setSelectedVoting}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminHistory;
