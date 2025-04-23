
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VotingResultsChart } from "./voting-results-chart";
import { VotingWithResults } from "@/types/voting";

interface VotingDetailsPanelProps {
  voting: VotingWithResults;
  onBack: () => void;
}

export function VotingDetailsPanel({ voting, onBack }: VotingDetailsPanelProps) {
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

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 text-votePurple hover:underline flex items-center"
      >
        ← Back to dashboard
      </button>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{voting.title}</h2>
        <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500 mt-1">
          <span>Code: <span className="font-mono">{voting.code}</span></span>
          <span>•</span>
          <span>{formatDate(voting.start_date)} - {formatDate(voting.end_date)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Total Votes</h3>
            <p className="text-3xl font-bold">{voting.totalVotes}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">
              {voting.status === 'completed' ? 'Winning Option' : 'Current Leader'}
            </h3>
            {voting.totalVotes > 0 ? (
              <>
                <p className="text-xl font-bold">{getWinningOption(voting)?.text}</p>
                <p className="text-gray-500">{getWinningOption(voting)?.votes} votes</p>
              </>
            ) : (
              <p className="text-gray-500">No votes recorded</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-2">Status</h3>
            <Badge className={`text-lg py-1 px-3 ${
              voting.status === 'completed' ? 'bg-green-500' : 
              voting.status === 'active' ? 'bg-blue-500' : 'bg-amber-500'
            }`}>
              {voting.status}
            </Badge>
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
              <h3 className="text-lg font-medium mb-4">
                {voting.status === 'completed' ? 'Final Results' : 'Current Results'}
              </h3>
              <VotingResultsChart voting={voting} />
              <div className="space-y-4">
                {voting.results.map((option) => (
                  <div key={option.optionId} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{option.text}</span>
                      <span className="font-medium">
                        {option.votes} votes 
                        ({voting.totalVotes > 0 
                          ? Math.round((option.votes / voting.totalVotes) * 100) 
                          : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-votePurple h-4 rounded-full"
                        style={{ 
                          width: voting.totalVotes > 0 
                            ? `${(option.votes / voting.totalVotes) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
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
                  {voting.options.map((option: any) => (
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
                        {voting.results.find(r => r.optionId === option.id)?.votes || 0}
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
  );
}
