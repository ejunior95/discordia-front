import { RapBattleArena } from '@/features/rap-battle/components/RapBattleArena';
import { RapBattleResult } from '@/features/rap-battle/components/RapBattleResult';
import { RapBattleSetup } from '@/features/rap-battle/components/RapBattleSetup';
import { useRapBattle } from '@/features/rap-battle/hooks/useRapBattle';

export default function RapBattle() {
  const {
    battle,
    isGenerating,
    start,
    generateRound,
    retryVerse,
    voteVerse,
    nextRound,
    finish,
    reset,
    abort,
  } = useRapBattle();

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="max-w-6xl mx-auto">
        {!battle || battle.status === 'setup' ? (
          <RapBattleSetup onStart={start} />
        ) : battle.status === 'finished' ? (
          <RapBattleResult battle={battle} onReset={reset} />
        ) : (
          <RapBattleArena
            battle={battle}
            isGenerating={isGenerating}
            onGenerateRound={() => generateRound()}
            onVote={(agent) => voteVerse(battle.currentRound, agent)}
            onRetry={(agent) => retryVerse(battle.currentRound, agent)}
            onNextRound={nextRound}
            onFinish={finish}
            onAbort={abort}
            onReset={reset}
          />
        )}
      </div>
    </section>
  );
}
