
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Search, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRequireAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { VotingSchedule } from "@/types/database";

const AdminHome = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [votings, setVotings] = useState<VotingSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Protect this route
  const { user } = useRequireAuth(UserRole.ADMIN);

  const fetchVotings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('voting_schedules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setVotings(data || []);
    } catch (error: any) {
      console.error("Error fetching votings:", error);
      toast({
        title: "Error",
        description: "Failed to load voting schedules",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVotings();
  }, [user]);

  const filteredVotings = votings.filter(voting =>
    voting.title.toLowerCase().includes(search.toLowerCase()) ||
    voting.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemoveVoting = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking remove button
    
    try {
      const { error } = await supabase
        .from('voting_schedules')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setVotings(votings.filter(voting => voting.id !== id));
      
      toast({
        title: "Voting Removed",
        description: "The voting schedule has been removed successfully.",
      });
    } catch (error: any) {
      console.error("Error removing voting:", error);
      toast({
        title: "Error",
        description: "Failed to remove voting schedule",
        variant: "destructive",
      });
    }
  };

  const handleEditVoting = (id: string) => {
    navigate(`/admin/schedule/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isVotingActive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const isVotingComplete = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    return now > end;
  };

  const isVotingUpcoming = (startDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    return now < start;
  };

  if (isLoading && !user) {
    return (
      <AdminLayout title="Scheduled Votings">
        <div className="text-center py-10">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Scheduled Votings">
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Search by title or code..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredVotings.length > 0 ? (
          filteredVotings.map(voting => (
            <Card key={voting.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => handleEditVoting(voting.id)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{voting.title}</h3>
                    {isVotingActive(voting.start_date, voting.end_date) ? (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
                    ) : isVotingComplete(voting.end_date) ? (
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Completed</span>
                    ) : (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Upcoming</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                    <span>Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{voting.code}</span></span>
                    <span>{formatDate(voting.start_date)} - {formatDate(voting.end_date)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 py-2 px-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600"
                  onClick={() => handleEditVoting(voting.id)}
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => handleRemoveVoting(voting.id, e)}
                >
                  <Trash2 size={16} className="mr-1" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No votings found.</p>
            <p className="mt-2">
              <Button 
                variant="link" 
                onClick={() => navigate('/admin/schedule')}
                className="text-votePurple"
              >
                Create your first voting
              </Button>
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
