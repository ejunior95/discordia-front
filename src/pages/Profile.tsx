import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PageHeader from "@/custom-components/PageHeader";
import { BADGES_CATALOG } from "@/features/account/account.constants";
import { useChatStats } from "@/features/account/hooks/useChatStats";
import { useBilling } from "@/features/account/hooks/useBilling";
import { formatLongDate, formatShortDate } from "@/features/account/format";
import { IA_CONFIG } from "@/features/chat/chat.constants";
import { useAuth } from "@/hooks/useAuth";
import { updateUserProfile } from "@/services/user.service";
import { formatFallbackAvatarStr } from "@/utils/globalFunctions";
import { pageMotion } from "@/utils/pageMotion";
import { cn } from "@/lib/utils";
import {
  Award,
  Github,
  Linkedin,
  Loader2,
  Lock,
  MessagesSquare,
  Pencil,
  Sparkles,
  ThumbsUp,
  Trophy,
  Twitter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Profile() {
  const { user, setUser } = useAuth();
  const stats = useChatStats();
  const billing = useBilling();

  const [bio, setBio] = useState(user?.bio ?? "");
  const [socials, setSocials] = useState({
    twitter: user?.socials?.twitter ?? "",
    github: user?.socials?.github ?? "",
    linkedin: user?.socials?.linkedin ?? "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setBio(user?.bio ?? "");
    setSocials({
      twitter: user?.socials?.twitter ?? "",
      github: user?.socials?.github ?? "",
      linkedin: user?.socials?.linkedin ?? "",
    });
  }, [
    user?.bio,
    user?.socials?.twitter,
    user?.socials?.github,
    user?.socials?.linkedin,
  ]);

  const currentPlan = billing.subscription
    ? (billing.plans.find((p) => p.slug === billing.subscription?.planSlug) ?? null)
    : null;
  const favorite = stats.topAgent ? IA_CONFIG[stats.topAgent] : null;
  const favoriteShare =
    stats.totalVotes > 0 ? Math.round(stats.topAgentShare * 100) : 0;

  const badgeContext = {
    totalRounds: stats.totalRounds,
    totalVotes: stats.totalVotes,
    uniqueAgentsVoted: stats.uniqueAgentsVoted,
    topAgent: stats.topAgent,
    topAgentVotes: stats.topAgentVotes,
  };

  const userBio = user?.bio ?? "";
  const userSocials = user?.socials ?? {};
  const bioChanged =
    bio !== userBio ||
    socials.twitter !== (userSocials.twitter ?? "") ||
    socials.github !== (userSocials.github ?? "") ||
    socials.linkedin !== (userSocials.linkedin ?? "");
  const unlockedBadges = BADGES_CATALOG.filter((badge) => badge.check(badgeContext));

  const handleSaveBio = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.id, {
        bio,
        socials: {
          twitter: socials.twitter || undefined,
          github: socials.github || undefined,
          linkedin: socials.linkedin || undefined,
        },
      });
      setUser({ ...user, bio, socials });
      toast.success("Bio atualizada.");
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erro ao atualizar bio";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const statCards = [
    { label: "Rodadas jogadas", value: stats.totalRounds, icon: MessagesSquare },
    { label: "Votos dados", value: stats.totalVotes, icon: ThumbsUp },
    { label: "IA favorita", value: favorite ? favorite.label : "—", icon: Sparkles },
    { label: "Domínio da favorita", value: favorite ? `${favoriteShare}%` : "—", icon: Trophy },
  ];

  return (
    <section className="w-full p-6 md:p-10">
      <motion.div {...pageMotion} className="flex w-full flex-col items-center">
        <PageHeader
          title="Meu perfil"
          description="Acompanhe seu progresso, suas conquistas e personalize sua presença no discordIA."
          actions={
            <Button variant="outline" asChild>
              <Link to="/settings">
                <Pencil className="mr-2 h-4 w-4" />
                Editar perfil
              </Link>
            </Button>
          }
        />

        <div className="flex flex-col w-full gap-6 lg:w-[80%] 2xl:w-[60%] 2xl:max-w-300">
          <Card>
            <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:items-start pt-6">
              <Avatar className="h-28 w-28 shrink-0 rounded-full">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.name}
                  className="object-cover object-center"
                />
                <AvatarFallback className="text-4xl">
                  {user ? formatFallbackAvatarStr(user) : "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 w-full space-y-3 text-center sm:text-left">
                <div>
                  <h2 className="truncate text-3xl font-bold tracking-tight">
                    {user?.name ?? "Usuário"}
                  </h2>
                  <p className="truncate text-muted-foreground">{user?.email}</p>
                </div>

                {(userSocials.twitter || userSocials.github || userSocials.linkedin) && (
                  <div className="flex items-center justify-center gap-4 sm:justify-start text-muted-foreground">
                    {userSocials.twitter && (
                      <a href={`https://x.com/${userSocials.twitter.replace('@', '')}`} target="_blank" rel="noreferrer" className="hover:text-primary border p-2 rounded-md transition-colors" title="Twitter / X">
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {userSocials.github && (
                      <a href={`https://github.com/${userSocials.github}`} target="_blank" rel="noreferrer" className="hover:text-primary border p-2 rounded-md transition-colors" title="GitHub">
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {userSocials.linkedin && (
                      <a href={`https://linkedin.com/in/${userSocials.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-primary border p-2 rounded-md transition-colors" title="LinkedIn">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                )}

                {user?.bio && (
                  <blockquote className="w-full md:max-w-225 break-words border-l-2 pl-4 italic">
                    {user?.bio}
                  </blockquote>
                )}
                
                <p className="text-muted-foreground text-sm">
                  Membro desde {formatLongDate(user?.createdAt)}
                </p>

                {unlockedBadges.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
                    {unlockedBadges.map((badge) => {
                      const Icon = badge.Icon;
                      return (
                        <div
                          key={badge.id}
                          title={badge.name}
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full",
                            badge.color,
                            badge.bgAndBorderColor ?? "bg-muted/40 border-border/50 border-2",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-2 pt-2 sm:justify-start">
                  {currentPlan ? (
                    <Badge variant="secondary">Plano {currentPlan.name}</Badge>
                  ) : billing.loading ? (
                    <Badge variant="outline">Carregando plano…</Badge>
                  ) : null}
                  {favorite ? (
                    <Badge variant="outline" className="gap-1">
                      <Sparkles className="h-3 w-3" />
                      Fã de {favorite.label}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map(({ label, value, icon: Icon }) => (
              <Card key={label} className="overflow-hidden">
                <CardContent>
                  <div className="relative flex items-center justify-between">
                    <p className="text-muted-foreground text-sm font-medium">
                      {label}
                    </p>
                    <Icon className="absolute -top-9 -right-10 text-muted-foreground h-34 w-34 rotate-20 opacity-10" />
                  </div>
                  <p className="mt-2 text-3xl md:text-4xl font-bold">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="flex-1 min-w-0 w-full lg:col-span-2">
              <CardHeader>
                <CardTitle>Sobre mim</CardTitle>
                <CardDescription>
                  Conte um pouco sobre você e adicione links pra suas redes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Curioso por IA, café e jogos de tabuleiro…"
                    rows={3}
                    maxLength={280}
                    className="resize-none"
                  />
                  <p className="text-muted-foreground text-right text-xs">
                    {bio.length}/280
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label
                      htmlFor="twitter"
                      className="flex items-center gap-2"
                    >
                      <Twitter className="h-4 w-4" /> Twitter / X
                    </Label>
                    <Input
                      id="twitter"
                      value={socials.twitter}
                      onChange={(e) =>
                        setSocials({ ...socials, twitter: e.target.value })
                      }
                      placeholder="@seuusuario"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github className="h-4 w-4" /> GitHub
                    </Label>
                    <Input
                      id="github"
                      value={socials.github}
                      onChange={(e) =>
                        setSocials({ ...socials, github: e.target.value })
                      }
                      placeholder="seuusuario"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="linkedin"
                      className="flex items-center gap-2"
                    >
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={socials.linkedin}
                      onChange={(e) =>
                        setSocials({ ...socials, linkedin: e.target.value })
                      }
                      placeholder="in/seuusuario"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleSaveBio}
                  disabled={!bioChanged || saving}
                  className="w-full md:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando…
                    </>
                  ) : (
                    "Salvar"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plano atual</CardTitle>
                <CardDescription>
                  {currentPlan?.description ??
                    (billing.loading ? "Carregando…" : "Plano indisponível")}
                </CardDescription>
              </CardHeader>
              <CardContent className="max-w-full space-y-2 md:flex md:flex-col md:h-full md:justify-center">
                <p className="text-3xl font-bold">{currentPlan?.name ?? "—"}</p>
                <p className="text-muted-foreground text-sm">
                  {currentPlan?.monthlyRoundsLimit
                    ? `${stats.roundsThisMonth} / ${currentPlan.monthlyRoundsLimit} rodadas este mês`
                    : currentPlan
                      ? "Rodadas ilimitadas"
                      : "—"}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/subscription">Gerenciar assinatura</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" /> Conquistas
              </CardTitle>
              <CardDescription>
                Desbloqueie conquistas conforme usa o DiscordIA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {BADGES_CATALOG.map((badge) => {
                  const Icon = badge.Icon;
                  const unlocked = badge.check(badgeContext);
                  return (
                    <div
                      key={badge.id}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                        unlocked
                          ? badge.bgAndBorderColor ?? "bg-muted/40 border-border/50"
                          : "bg-muted/30 opacity-70",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                          unlocked
                            ? badge.color
                            : "bg-muted",
                        )}
                      >
                        {unlocked ? (
                          <Icon className="h-8 w-8" />
                        ) : (
                          <Lock className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{badge.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rodadas recentes</CardTitle>
              <CardDescription>Suas últimas comparações de IA.</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.loading ? (
                <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-center text-sm">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <p>Carregando rodadas…</p>
                </div>
              ) : stats.recentRounds.length === 0 ? (
                <div className="text-muted-foreground flex flex-col items-center gap-2 py-8 text-center text-sm">
                  <MessagesSquare className="h-8 w-8" />
                  <p>Você ainda não fez nenhuma rodada.</p>
                  <Button asChild variant="link">
                    <Link to="/chat">Iniciar uma comparação</Link>
                  </Button>
                </div>
              ) : (
                <ul className="divide-y">
                  {stats.recentRounds.map((round) => {
                    const winner = round.winner
                      ? IA_CONFIG[round.winner]
                      : null;
                    return (
                      <li
                        key={round.id}
                        className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {round.question}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatShortDate(round.askedAt)}
                          </p>
                        </div>
                        {winner ? (
                          <Badge variant="secondary" className="shrink-0">
                            <Trophy className="mr-1 h-3 w-3" />
                            {winner.label}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="shrink-0">
                            Sem vencedor
                          </Badge>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
            {stats.recentRounds.length > 0 ? (
              <CardFooter className="justify-end">
                <Button asChild variant="link">
                  <Link to="/chat">Ver todas</Link>
                </Button>
              </CardFooter>
            ) : null}
          </Card>
        </div>
      </motion.div>
    </section>
  );
}