'use client'

interface MatchNode {
  id: string
  player1: string
  player2: string
  score1?: number
  score2?: number
  winner?: string
}

interface BracketViewProps {
  bracketData: {
    rounds: MatchNode[][]
  }
}

export function BracketView({ bracketData }: BracketViewProps) {
  if (!bracketData?.rounds) return <div className="text-center p-8 text-muted-foreground">Bracket belum digenerate.</div>

  return (
    <div className="flex gap-8 overflow-x-auto pb-8 min-h-[400px] p-4">
      {bracketData.rounds.map((round, roundIndex) => (
        <div key={roundIndex} className="flex flex-col justify-around gap-4 min-w-[200px]">
          <h3 className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Round {roundIndex + 1}
          </h3>
          {round.map((match) => (
            <div 
              key={match.id} 
              className="relative bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`p-2 flex justify-between items-center text-sm ${match.winner === match.player1 ? 'bg-primary/5 font-bold' : ''}`}>
                <span className="truncate max-w-[120px]">{match.player1 || 'TBC'}</span>
                <span className="font-mono">{match.score1 ?? '-'}</span>
              </div>
              <div className="h-[1px] bg-border" />
              <div className={`p-2 flex justify-between items-center text-sm ${match.winner === match.player2 ? 'bg-primary/5 font-bold' : ''}`}>
                <span className="truncate max-w-[120px]">{match.player2 || 'TBC'}</span>
                <span className="font-mono">{match.score2 ?? '-'}</span>
              </div>
              
              {/* Bracket Connectors - Simple CSS representation */}
              {roundIndex < bracketData.rounds.length - 1 && (
                <div className="absolute -right-4 top-1/2 w-4 h-[2px] bg-border" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
