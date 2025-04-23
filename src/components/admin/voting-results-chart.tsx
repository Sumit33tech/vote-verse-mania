
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { VotingWithResults } from "@/types/voting";

interface VotingResultsChartProps {
  voting: VotingWithResults;
}

export function VotingResultsChart({ voting }: VotingResultsChartProps) {
  const renderTooltipContent = (props: any) => {
    return (
      <ChartTooltipContent
        {...props}
        formatter={(value, name) => [
          `${value} votes (${
            Math.round((Number(value) / voting.totalVotes) * 100)
          }%)`,
          name
        ]}
      />
    );
  };

  if (voting.totalVotes === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No votes have been recorded for this voting.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 h-60">
      <ChartContainer 
        className="h-full"
        config={{
          votes: { theme: { dark: '#7c3aed', light: '#7c3aed' } }
        }}
      >
        <BarChart
          data={voting.results.map(r => ({
            name: r.text,
            votes: r.votes
          }))}
          margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
        >
          <ChartTooltip content={renderTooltipContent} />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end"
            height={70}
            tickMargin={15}
          />
          <YAxis />
          <Bar dataKey="votes" name="Votes" fill="var(--color-votes)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
