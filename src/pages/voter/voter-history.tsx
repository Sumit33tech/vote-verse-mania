
import { VoterLayout } from "@/components/layout/voter-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

// Mock history data
const mockVotingHistory = [
  { 
    id: "1", 
    title: "Department Head Election", 
    date: new Date(2023, 3, 10),
    selectedOption: "Sarah Johnson",
    result: "Sarah Johnson",
    totalVotes: 45,
  },
  { 
    id: "2", 
    title: "Office Relocation Vote", 
    date: new Date(2023, 2, 15),
    selectedOption: "Suburban Campus",
    result: "Suburban Campus",
    totalVotes: 38,
  },
];

const VoterHistory = () => {
  const [selectedVoting, setSelectedVoting] = useState<typeof mockVotingHistory[0] | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <VoterLayout title="My Voting History">
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
            <p className="text-gray-500 mt-1">
              Voted on {formatDate(selectedVoting.date)}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Your Vote</h3>
                <p className="text-xl font-bold text-votePurple">{selectedVoting.selectedOption}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Final Result</h3>
                <p className="text-xl font-bold">{selectedVoting.result}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Total participants: {selectedVoting.totalVotes}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-500 mb-6">
            View your past voting history and results
          </p>
          
          {mockVotingHistory.length > 0 ? (
            mockVotingHistory.map(voting => (
              <Card 
                key={voting.id}
                className="cursor-pointer hover:border-votePurple transition-colors"
                onClick={() => setSelectedVoting(voting)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{voting.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(voting.date)}
                      </p>
                    </div>
                    <Badge className="bg-green-500">Completed</Badge>
                  </div>
                  
                  <div className="mt-3 flex justify-between text-sm">
                    <span>You voted: <span className="font-medium text-votePurple">{voting.selectedOption}</span></span>
                    <span className="text-votePurple">View Details →</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">You haven't participated in any voting sessions yet.</p>
            </div>
          )}
        </div>
      )}
    </VoterLayout>
  );
};

export default VoterHistory;
