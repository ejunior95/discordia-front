import { RpgSetup } from '@/features/rpg/components/RpgSetup';
import { RpgTable } from '@/features/rpg/components/RpgTable';
import { useRpgCampaign } from '@/features/rpg/hooks/useRpgCampaign';

export default function RolePlaying() {
  const {
    campaign,
    isGenerating,
    currentActor,
    start,
    submitUserTurn,
    generateAITurn,
    retryLastTurn,
    skipTurn,
    pause,
    resume,
    reset,
    abort,
  } = useRpgCampaign();

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="max-w-7xl mx-auto">
        {!campaign || campaign.status === 'setup' || !currentActor ? (
          <RpgSetup onStart={start} />
        ) : (
          <RpgTable
            campaign={campaign}
            currentActor={currentActor}
            isGenerating={isGenerating}
            onSubmitUser={submitUserTurn}
            onGenerateAI={generateAITurn}
            onRetryLast={retryLastTurn}
            onSkip={skipTurn}
            onAbort={abort}
            onPause={pause}
            onResume={resume}
            onReset={reset}
          />
        )}
      </div>
    </section>
  );
}
