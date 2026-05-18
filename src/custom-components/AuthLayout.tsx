import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, Trophy } from 'lucide-react';
import Logo from '@/assets/discordia-logo-removebg2.png';

const AnimatedAuroraBackground = lazy(
  () => import('./AnimatedAuroraBackground'),
);

interface AuthLayoutProps {
  children: React.ReactNode;
}

const HIGHLIGHTS = [
  {
    icon: Bot,
    title: 'Compare 4 IAs lado a lado',
    description:
      'Envie uma pergunta para ChatGPT, Gemini, DeepSeek e Grok ao mesmo tempo e veja como cada uma responde.',
  },
  {
    icon: Trophy,
    title: 'Jogos com IA',
    description:
      'Desafie agentes em xadrez, jokenpô, forca, RPG e rap battle. Aprenda enquanto se diverte.',
  },
  {
    icon: Sparkles,
    title: 'Vote na melhor resposta',
    description:
      'Construa seu histórico, ganhe conquistas e descubra qual IA combina mais com você.',
  },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-dvh w-full lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="text-primary-foreground relative hidden flex-col justify-between overflow-hidden bg-[#082640] p-10 lg:flex">
        <Suspense
          fallback={
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 80% at 20% 20%, #0F6CA7 0%, #082640 55%, #050d18 100%), radial-gradient(60% 50% at 80% 80%, #E48318 0%, transparent 60%)',
              }}
            />
          }
        >
          <AnimatedAuroraBackground />
        </Suspense>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-1 bg-[linear-gradient(90deg,rgba(3,12,24,0.72)_0%,rgba(3,12,24,0.46)_46%,rgba(3,12,24,0.18)_100%)]"
        />

        <Link
          to="/"
          className="relative z-10 flex items-center gap-2 text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]"
        >
          <img src={Logo} alt="DiscordIA" className="h-12 w-16" />
          <span className="text-2xl font-semibold tracking-tight text-white">
            DiscordIA
          </span>
        </Link>

        <div className="relative z-10 w-full space-y-8 drop-shadow-[0_2px_18px_rgba(0,0,0,0.55)]">
          <div className="space-y-3 w-full">
            <h1 className="text-4xl leading-tight font-bold tracking-tight text-balance text-white xl:text-5xl">
              Compare. Jogue. <br /> Encontre sua IA favorita.
            </h1>
            <p className="text-base leading-relaxed text-white/88 xl:text-lg">
              A arena onde as principais IAs do mercado se enfrentam — e você decide quem vence.
            </p>
          </div>

          <ul className="space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/7.5 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.18)] backdrop-blur-[2px]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/12 text-white shadow-inner shadow-white/10">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="space-y-0.5">
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-sm leading-snug text-white/78">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/70 drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
          © {new Date().getFullYear()} DiscordIA · Todos os direitos reservados.
        </p>
      </aside>

      {/* Form panel */}
      <main className="bg-background flex w-full flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
