import { useState } from 'react';
import { ChatEmptyState } from './components/ChatEmptyState';
import { QuestionInput } from './components/QuestionInput';
import { RoundsHistory } from './components/RoundsHistory';
import { useChatRounds } from './hooks/useChatRounds';

export default function Chat() {
  const { rounds, isAsking, ask, retry, vote, abort, clear } = useChatRounds();
  const [question, setQuestion] = useState('');

  const handleSubmit = async () => {
    const q = question.trim();
    if (!q) return;
    setQuestion('');
    await ask(q);
  };

  return (
    <section className="flex flex-col h-[calc(100dvh-5rem)] max-w-6xl mx-auto w-full px-4 md:px-6 pb-4">
      {rounds.length === 0 ? (
        <ChatEmptyState onSelectSuggestion={setQuestion} />
      ) : (
        <RoundsHistory
          rounds={rounds}
          onVote={vote}
          onRetry={retry}
          onClear={clear}
        />
      )}
      <div className="pt-4 sticky bottom-0 bg-background">
        <QuestionInput
          value={question}
          onChange={setQuestion}
          onSubmit={handleSubmit}
          onAbort={abort}
          isAsking={isAsking}
          autoFocus
        />
      </div>
    </section>
  );
}
