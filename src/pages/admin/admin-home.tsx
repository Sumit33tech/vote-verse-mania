
import { AdminLayout } from "@/components/layout/admin-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const mockVotings = [
  { 
    id: "1", 
    title: "Board Member Election", 
    code: "BOARD123",
    startDate: new Date(2023, 4, 15, 10, 0),
    endDate: new Date(2023, 4, 15, 18, 0),
  },
  { 
    id: "2", 
    title: "Budget Approval", 
    code: "BUDGET456",
    startDate: new Date(2023, 4, 20, 9, 0),
    endDate: new Date(2023, 4, 22, 17, 0),
  },
  { 
    id: "3", 
    title: "New Logo Selection", 
    code: "LOGO789",
    startDate: new Date(2023, 5, 1, 8, 0),
    endDate: new Date(2023, 5, 5, 23, 59),
  },
];

const AdminHome = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [votings, setVotings] = useState(mockVotings);

  const filteredVotings = votings.filter(voting =>
    voting.title.toLowerCase().includes(search.toLowerCase()) ||
    voting.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemoveVoting = (id: string) => {
    setVotings(votings.filter(voting => voting.id !== id));
  };

  const handleEditVoting = (id: string) => {
    navigate(`/admin/schedule/${id}`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
                  <h3 className="font-semibold text-lg">{voting.title}</h3>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                    <span>Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{voting.code}</span></span>
                    <span>{formatDate(voting.startDate)} - {formatDate(voting.endDate)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 py-2 px-4 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveVoting(voting.id)}
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
