import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Gamepad2,
  MessageSquare,
  MicVocal,
  Sparkles,
  Swords,
  Trophy,
  Vote,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { IA_CONFIG } from '@/features/chat/chat.constants';
import { useAgentsDisplay } from '@/hooks/useAgentDisplay';
import type { AgentIA } from '@/features/chat/types';
import { pageMotion } from '@/utils/pageMotion';
import { DiscordiaLogo3D } from '@/custom-components/DiscordiaLogo3D';
import Discordia3dLogo from '../assets/discordia-logo-3D.png';
import DiscordiaLogo from '../assets/discordia-logo-removebg2.png';
import questionsBg from '../assets/questions-bg.jpeg';
import gamesBg from '../assets/games-bg.jpeg';
import rhymeBg from '../assets/rhyme-bg.jpg';
import rpgBg from '../assets/rpg-bg.png';

const AGENTS: AgentIA[] = ['chat-gpt', 'gemini', 'deepseek', 'grok'];

const FEATURES = [
  {
    id: 'chat',
    title: 'Chat conflituoso',
    tagline: 'Pergunte uma vez, receba 4 respostas',
    desc: 'ChatGPT, Gemini, DeepSeek e Grok respondem à mesma pergunta em paralelo. Compare lado a lado, vote na melhor e veja quem dominou a rodada.',
    icon: MessageSquare,
    bgImage: questionsBg,
    link: '/chat',
    accent: 'from-indigo-500 to-violet-500',
    badge: 'Mais usado',
  },
  {
    id: 'rap',
    title: 'Batalhas de rima',
    tagline: 'Duelo estilo 8 Mile entre IAs',
    desc: 'Escolha dois competidores, defina um tema e assista a 3 rounds de versos cortantes. Você é o público — e o juiz que aplaude o vencedor.',
    icon: MicVocal,
    bgImage: rhymeBg,
    link: '/rap-battle',
    accent: 'from-fuchsia-500 to-cyan-500',
    badge: 'Novo',
  },
  {
    id: 'rpg',
    title: 'RPG colaborativo',
    tagline: 'Mestre humano ou IA, jogadores IA',
    desc: 'Monte uma mesa em segundos: cenário, mestre e jogadores. Personagens com ficha completa, narrativa que evolui turno a turno.',
    icon: Swords,
    bgImage: rpgBg,
    link: '/rpg',
    accent: 'from-amber-500 to-rose-500',
    badge: 'Novo',
  },
  {
    id: 'games',
    title: 'Jogos contra IA',
    tagline: 'Xadrez, jogo da velha e mais',
    desc: 'Desafie cada IA em um tabuleiro. Ou organize torneios em que elas se enfrentam enquanto você analisa quem joga melhor.',
    icon: Gamepad2,
    bgImage: gamesBg,
    link: '/games',
    accent: 'from-emerald-500 to-teal-500',
    badge: 'Novo',
  },
] as const;

const STATS = [
  { value: '4', label: 'IAs em competição' },
  { value: '1 voto', label: 'Decide a rodada' },
  { value: '0', label: 'Anúncios ou viés' },
  { value: '100%', label: 'Comparação lado a lado' },
];

const HOW_STEPS = [
  {
    icon: Sparkles,
    title: 'Faça uma pergunta',
    desc: 'Digite o que quiser saber. Disparamos a mesma pergunta para todas as IAs simultaneamente.',
  },
  {
    icon: Zap,
    title: 'Receba respostas em paralelo',
    desc: 'Streaming individual para cada modelo. Você compara estilo, profundidade e velocidade.',
  },
  {
    icon: Vote,
    title: 'Vote no vencedor',
    desc: 'Decida quem mandou bem em cada rodada. O placar é seu, sem algoritmo opinando.',
  },
];

const PRICES = [
  {
    name: 'Grátis',
    price: 'R$ 0',
    period: 'pra sempre',
    perks: ['10 créditos por mês', 'Chat conflituoso'],
    cta: 'Começar grátis',
    highlight: false,
  },
  {
    name: 'Basic',
    price: 'R$ 49,99',
    period: 'por mês',
    perks: ['200 créditos por mês', 'Chat conflituoso', 'Jogos contra IA'],
    cta: 'Assinar Basic',
    highlight: true,
    badge: 'Recomendado',
  },
  {
    name: 'Premium',
    price: 'R$ 79,99',
    period: 'por mês',
    perks: ['Créditos ilimitados', 'Chat conflituoso', 'Jogos contra IA', 'Batalha de rima', 'RPG colaborativo', 'Acesso antecipado a novos modos'],
    cta: 'Assinar Premium',
    highlight: false,
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const ctaTarget = user ? '/home' : '/register';
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div {...pageMotion} className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
      <TopNav scrolled={scrolled} user={!!user} />
      <Hero ctaTarget={ctaTarget} />
      <AgentsStrip />
      <StatsBand />
      <FeaturesShowcase
        active={activeFeature}
        onChange={setActiveFeature}
        ctaTarget={ctaTarget}
      />
      <HowItWorks />
      <Pricing ctaTarget={ctaTarget} />
      <FinalCTA ctaTarget={ctaTarget} />
      <Footer />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Nav                                                                       */
/* -------------------------------------------------------------------------- */

function TopNav({ scrolled, user }: { scrolled: boolean; user: boolean }) {
  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent',
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={DiscordiaLogo} alt="DiscordIA" className="size-9 md:size-12 object-contain" />
          <span className="font-extrabold text-xl md:text-2xl tracking-tight">
            Discord
            <span className="text-blue-400">I</span>
            <span className="text-amber-500">A</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-md text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Recursos</a>
          <a href="#how" className="hover:text-white transition-colors">Como funciona</a>
          <a href="#pricing" className="hover:text-white transition-colors">Planos</a>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/home">
              <Button size="sm" className="cursor-pointer bg-white text-black hover:bg-zinc-200">
                Entrar no app
                <ArrowRight size={14} />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="cursor-pointer text-zinc-300 hover:text-white hover:bg-white/5">
                  Entrar
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="cursor-pointer bg-white text-black hover:bg-zinc-200">
                  Criar conta
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

function Hero({ ctaTarget }: { ctaTarget: string }) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 min-h-screen">
      {/* 3D logo background */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <DiscordiaLogo3D
          fallbackSrc={Discordia3dLogo}
          fallbackAlt=""
          className="absolute inset-0 w-full h-full opacity-40"
        />
      </div>

      {/* gradient mesh */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[60rem] rounded-full bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/20 to-transparent blur-3xl" />
        <div className="absolute top-1/2 -right-32 size-[36rem] rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-0 size-[36rem] rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,rgba(9,9,11,0.85)_70%)]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur px-3 py-1 text-sm text-zinc-300 mb-8"
        >
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          Versão BETA
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]"
        >
          As IAs competem.
          <br />
          <span className="bg-linear-to-r from-indigo-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">
            Você decide quem vence.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed"
        >
          Uma única plataforma onde ChatGPT, Gemini, DeepSeek e Grok respondem,
          rimam, jogam e narram lado a lado — e o seu voto define a melhor.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 w-full"
        >
          <Link to={ctaTarget}>
            <Button className="cursor-pointer w-80 h-12 px-0 md:px-7 text-base bg-white text-black hover:bg-zinc-200 gap-2 shadow-lg shadow-white/10">
              Começar agora
              <ArrowRight size={16} />
            </Button>
          </Link>
          <a href="#features">
            <Button
              variant="outline"
              className="cursor-pointer w-80 h-12 px-0 md:px-7 text-base bg-white/5 border-white/15 text-white hover:bg-white/10 hover:text-white"
            >
              Ver recursos
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Agents strip                                                              */
/* -------------------------------------------------------------------------- */

function AgentsStrip() {
  const agentsDisplay = useAgentsDisplay();
  return (
    <section className="relative border-y border-white/5 bg-zinc-950/60 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-center text-md uppercase tracking-[0.2em] text-zinc-500 mb-6">
          Os competidores
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-6">
          {AGENTS.map((agent) => {
            const cfg = agentsDisplay[agent];
            const Icon = cfg.Icon;
            return (
              <div
                key={agent}
                className="group flex items-center justify-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-4 transition-all hover:border-white/15 hover:bg-white/[0.06]"
              >
                <div className={cn('size-14 rounded-xl flex items-center justify-center shrink-0', cfg.iconClass)}>
                  <Icon size={30} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-md">{cfg.label}</p>
                  <p className="text-sm text-zinc-500">{cfg.model}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stats band                                                                */
/* -------------------------------------------------------------------------- */

function StatsBand() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.04] to-transparent p-5 md:p-6"
          >
            <p className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
              {s.value}
            </p>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Features showcase                                                         */
/* -------------------------------------------------------------------------- */

function FeaturesShowcase({
  active,
  onChange,
  ctaTarget,
}: {
  active: number;
  onChange: (i: number) => void;
  ctaTarget: string;
}) {
  const feat = FEATURES[active];
  const Icon = feat.icon;

  return (
    <section id="features">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-md uppercase tracking-[0.2em] text-amber-400/80 mb-3">Recursos</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Quatro modos. Uma única arena.
          </h2>
          <p className="mt-4 text-zinc-400">
            Cada experiência foi pensada para destacar diferenças reais entre os modelos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tabs verticais */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            {FEATURES.map((f, i) => {
              const FIcon = f.icon;
              const isActive = i === active;
              return (
                <button
                  key={f.id}
                  onClick={() => onChange(i)}
                  className={cn(
                    'group relative text-left rounded-xl border p-4 md:p-5 transition-all cursor-pointer',
                    isActive
                      ? 'border-white/20 bg-white/[0.06]'
                      : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'size-10 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br',
                        f.accent,
                      )}
                    >
                      <FIcon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base md:text-lg">{f.title}</h3>
                        {f.badge && (
                          <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-zinc-300">
                            {f.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-400 mt-0.5">{f.tagline}</p>
                    </div>
                  </div>
                  {isActive && (
                    <motion.span
                      layoutId="feature-active-bar"
                      className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-gradient-to-b from-amber-400 to-fuchsia-500"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Preview */}
          <div className="lg:col-span-7">
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-2xl border border-white/10 overflow-hidden h-full min-h-[26rem] flex flex-col"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${feat.bgImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/30" />

              <div className="relative flex-1 flex flex-col justify-between p-6 md:p-8">
                <div
                  className={cn(
                    'self-start rounded-xl bg-gradient-to-br p-3 shadow-lg',
                    feat.accent,
                  )}
                >
                  <Icon size={26} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{feat.title}</h3>
                  <p className="text-sm md:text-base text-zinc-300 mt-2 max-w-xl leading-relaxed">
                    {feat.desc}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link to={ctaTarget}>
                      <Button className="cursor-pointer bg-white text-black hover:bg-zinc-200 gap-2">
                        Experimentar
                        <ArrowRight size={14} />
                      </Button>
                    </Link>
                    <div className="flex -space-x-2">
                      {AGENTS.map((a) => {
                        const cfg = IA_CONFIG[a];
                        const AIIcon = cfg.Icon;
                        return (
                          <div
                            key={a}
                            className={cn(
                              'size-8 rounded-full border-2 border-zinc-950 flex items-center justify-center',
                              cfg.iconClass,
                            )}
                            title={cfg.label}
                          >
                            <AIIcon size={14} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  How it works                                                              */
/* -------------------------------------------------------------------------- */

function HowItWorks() {
  return (
    <section id="how" className="py-12 md:py-20 border-t border-white/5 bg-linear-to-b from-zinc-950 to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-md uppercase tracking-[0.2em] text-amber-400/80 mb-3">Como funciona</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Três passos, infinitas rodadas.
          </h2>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="relative rounded-2xl border border-white/5 bg-white/[0.03] p-6 md:p-7"
              >
                <span className="absolute -top-3 -left-3 size-10 rounded-full bg-zinc-950 border border-white/10 flex items-center justify-center text-sm font-bold text-amber-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="size-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-amber-300" />
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{step.desc}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pricing                                                                   */
/* -------------------------------------------------------------------------- */

function Pricing({ ctaTarget }: { ctaTarget: string }) {
  return (
    <section id="pricing" className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-md uppercase tracking-[0.2em] text-amber-400/80 mb-3">Planos</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Escolha o seu nível.
          </h2>
          <p className="mt-4 text-zinc-400">
            Comece grátis. Suba quando quiser mais créditos e modelos premium.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRICES.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={cn(
                'relative rounded-2xl border p-7 flex flex-col',
                plan.highlight
                  ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/[0.08] to-transparent shadow-2xl shadow-amber-500/10'
                  : 'border-white/5 bg-white/[0.03]',
              )}
            >
              {plan.highlight && plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-wide px-3 py-1 rounded-full bg-amber-500 text-black font-semibold flex items-center gap-1 shadow-lg">
                  <Trophy size={11} />
                  {plan.badge}
                </span>
              )}
              <h3 className="text-lg font-semibold text-zinc-300">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="text-sm text-zinc-500">/ {plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3 flex-1">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check size={16} className={cn('mt-0.5 shrink-0', plan.highlight ? 'text-amber-400' : 'text-emerald-400')} />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <Link to={ctaTarget} className="mt-7">
                <Button
                  className={cn(
                    'w-full cursor-pointer h-11',
                    plan.highlight
                      ? 'bg-amber-500 text-black hover:bg-amber-400'
                      : 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
                  )}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Final CTA                                                                 */
/* -------------------------------------------------------------------------- */

function FinalCTA({ ctaTarget }: { ctaTarget: string }) {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/20 via-fuchsia-600/15 to-amber-500/20 p-10 md:p-16 text-center">
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="absolute -top-20 -left-20 size-80 rounded-full bg-indigo-500/30 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 size-80 rounded-full bg-amber-500/30 blur-3xl" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Pronto pra ver quem é a melhor IA?
          </h2>
          <p className="mt-4 text-zinc-300 max-w-2xl mx-auto">
            Crie sua conta em segundos e comece a votar agora mesmo. Sem cartão, sem fricção.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center w-full">
            <Link to={ctaTarget}>
              <Button className="cursor-pointer h-12 w-full px-0 md:px-6 text-base bg-white text-black hover:bg-zinc-200 gap-2">
                Começar agora
                <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="#features">
              <Button
                variant="outline"
                className="cursor-pointer h-12 w-full px-0 md:px-6 text-base bg-transparent border-white/20 text-white hover:bg-white/5 hover:text-white"
              >
                Ver recursos
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={DiscordiaLogo} alt="DiscordIA" className="size-9 object-contain" />
          <span className="font-bold text-md">
            Discord<span className="text-blue-400">I</span><span className="text-amber-500">A</span>
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} DiscordIA · Feito com IA, julgado por humanos.
        </p>
      </div>
    </footer>
  );
}
