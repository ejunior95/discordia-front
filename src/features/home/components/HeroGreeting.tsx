import { useAuth } from '@/hooks/useAuth';
import { verifyDayOrNight } from '@/utils/globalFunctions';

const GREETINGS = [
  'Pronto para ver as IAs duelarem hoje?',
  'A arena está montada. Que a melhor mente vença!',
  'Sente-se, pergunte e assista ao show das máquinas.',
  'Você pergunta, elas competem pelo seu voto.',
  'Inteligências artificiais em guerra — você é o juiz.',
];

export function HeroGreeting() {
  const { user } = useAuth();
  const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  const firstName = user?.name?.split(' ')[0] ?? '';

  return (
    <section className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-primary/10 via-background to-background p-6 md:p-10">
      <div className="absolute -top-10 -right-10 size-48 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-12 -left-12 size-56 rounded-full bg-amber-500/10 blur-3xl" aria-hidden />
      <div className="relative flex flex-col gap-5">
        {/* <span className="inline-flex w-fit items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-[0.72rem] md:text-md font-medium text-muted-foreground backdrop-blur">
          <Sparkles size={20} className="text-amber-500" />
          Arena das IAs · Temporada em andamento
        </span> */}
        <h1 className="font-extrabold tracking-tight text-4xl md:text-5xl xl:text-6xl">
          {verifyDayOrNight()}
          {firstName ? `, ${firstName}` : ''}!
        </h1>
        <p className="text-lg md:text-2xl font-medium text-muted-foreground max-w-2xl">
          {greeting}
        </p>
      </div>
    </section>
  );
}
