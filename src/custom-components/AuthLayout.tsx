import { Link } from 'react-router-dom';
import { Bot, Sparkles, Trophy } from 'lucide-react';
import Logo from '@/assets/discordia-logo-removebg2.png';

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
      <aside className="from-primary/95 via-primary/80 to-primary/60 text-primary-foreground relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br p-10 lg:flex">
        <div className="bg-primary-foreground/10 pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-primary-foreground/5 pointer-events-none absolute -bottom-40 -left-20 h-[28rem] w-[28rem] rounded-full blur-3xl" />

        <Link to="/" className="relative z-10 flex items-center gap-2">
          <img src={Logo} alt="DiscordIA" className="h-10 w-12" />
          <span className="text-2xl font-semibold tracking-tight">DiscordIA</span>
        </Link>

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl leading-tight font-bold tracking-tight xl:text-5xl">
              Compare. Jogue. <br /> Encontre sua IA favorita.
            </h1>
            <p className="text-primary-foreground/90 max-w-md text-base xl:text-lg">
              A arena onde as principais IAs do mercado se enfrentam — e você decide quem vence.
            </p>
          </div>

          <ul className="space-y-5">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="bg-primary-foreground/15 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="space-y-0.5">
                  <p className="font-semibold">{title}</p>
                  <p className="text-primary-foreground/80 text-sm leading-snug">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-primary-foreground/70 relative z-10 text-xs">
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
