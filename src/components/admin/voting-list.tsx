
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VotingWithResults } from "@/types/voting";

interface VotingListProps {
  votings: VotingWithResults[];
  onSelectVoting: (voting: VotingWithResults) => void;
}

export function VotingList({ votings, onSelectVoting }: VotingListProps) {
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

  if (votings.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md bg-gray-50">
        <p className="text-gray-500">No votings found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {votings.map(voting => (
        <Card 
          key={voting.id}
          className="cursor-pointer hover:border-votePurple transition-colors"
          onClick={() => onSelectVoting(voting)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{voting.title}</h3>
                <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500 mt-1">
                  <span>Code: <span className="font-mono">{voting.code}</span></span>
                  <span>•</span>
                  <span>{formatDate(voting.start_date)} - {formatDate(voting.end_date)}</span>
                </div>
              </div>
              <Badge className={`${
                voting.status === 'completed' ? 'bg-green-500' : 
                voting.status === 'active' ? 'bg-blue-500' : 'bg-amber-500'
              }`}>
                {voting.status}
              </Badge>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span>
                {voting.totalVotes > 0 
                  ? `${voting.totalVotes} votes` 
                  : "No votes recorded"}
              </span>
              <span className="text-votePurple">View Details →</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
