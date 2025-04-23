
import { AdminLayout } from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Mock history data
const mockHistory = [
  { 
    id: "1", 
    title: "Department Head Election", 
    code: "DEPT456",
    startDate: new Date(2023, 3, 10, 9, 0),
    endDate: new Date(2023, 3, 10, 17, 0),
    status: "completed",
    totalVotes: 45,
    options: [
      { id: "1", text: "Sarah Johnson", votes: 20 },
      { id: "2", text: "Robert Chen", votes: 15 },
      { id: "3", text: "Anita Patel", votes: 10 },
    ],
  },
  { 
    id: "2", 
    title: "Office Relocation Vote", 
    code: "OFFICE789",
    startDate: new Date(2023, 2, 15, 10, 0),
    endDate: new Date(2023, 2, 20, 18, 0),
    status: "completed",
    totalVotes: 38,
    options: [
      { id: "1", text: "Downtown Location", votes: 12 },
      { id: "2", text: "Suburban Campus", votes: 26 },
    ],
  },
];

const AdminHistory = () => {
  const [selectedVoting, setSelectedVoting] = useState<typeof mockHistory[0] | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWinningOption = (voting: typeof mockHistory[0]) => {
    return voting.options.reduce((prev, current) => 
      (prev.votes > current.votes) ? prev : current
    );
  };

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
              <span>{formatDate(selectedVoting.startDate)} - {formatDate(selectedVoting.endDate)}</span>
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
                <p className="text-3xl font-bold">{getWinningOption(selectedVoting).text}</p>
                <p className="text-gray-500">{getWinningOption(selectedVoting).votes} votes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Status</h3>
                <Badge className="text-lg py-1 px-3 bg-green-500">{selectedVoting.status}</Badge>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Results Breakdown</h3>
              
              <div className="h-[300px]">
                {/* Simple chart visualization */}
                <div className="flex flex-col space-y-4">
                  {selectedVoting.options.map((option) => (
                    <div key={option.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{option.text}</span>
                        <span className="font-medium">{option.votes} votes ({Math.round((option.votes / selectedVoting.totalVotes) * 100)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-votePurple h-4 rounded-full"
                          style={{ width: `${(option.votes / selectedVoting.totalVotes) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-500 mb-6">
            View results and statistics from past voting sessions
          </p>
          
          {mockHistory.map(voting => (
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
                      <span>{formatDate(voting.startDate)}</span>
                    </div>
                  </div>
                  <Badge className="bg-green-500">{voting.totalVotes} votes</Badge>
                </div>
                
                <div className="mt-3 flex justify-between text-sm">
                  <span>Winner: {getWinningOption(voting).text}</span>
                  <span className="text-votePurple">View Details →</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminHistory;
