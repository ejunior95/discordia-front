import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { HeroGreeting } from "@/features/home/components/HeroGreeting";
import { StatsOverview } from "@/features/home/components/StatsOverview";
import { LeaderboardCard } from "@/features/home/components/LeaderboardCard";
import { IAOfTheWeekCard } from "@/features/home/components/IAOfTheWeekCard";
import { PerformanceChart } from "@/features/home/components/PerformanceChart";
import { RecentActivityCard } from "@/features/home/components/RecentActivityCard";
import { QuickShortcuts } from "@/features/home/components/QuickShortcuts";
import { useHomeSnapshot } from "@/features/home/hooks/useHomeSnapshot";
import Loader from "@/custom-components/Loader";
import { Button } from "@/components/ui/button";
import { pageMotion } from "@/utils/pageMotion";

export default function Home() {
  const { data, isLoading, error, refetch } = useHomeSnapshot();

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 pt-2 md:pt-4">
      <motion.div
        {...pageMotion}
        className="max-w-7xl mx-auto flex flex-col gap-5 md:gap-6"
      >
        <HeroGreeting />
        <QuickShortcuts />

        <div className="relative text-center text-md uppercase tracking-wider text-muted-foreground after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-3 select-none">Estatísticas Globais</span>
        </div>

        {isLoading && !data && (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-center">
            <AlertCircle className="text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={refetch}>
              Tentar novamente
            </Button>
          </div>
        )}

        {data && (
          <>
            <StatsOverview totals={data.totals} />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6">
              <div className="xl:col-span-6">
                <LeaderboardCard entries={data.leaderboard} />
              </div>
              <div className="xl:col-span-6">
                <IAOfTheWeekCard data={data.iaOfWeek} />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6">
              <div className="xl:col-span-8">
                <PerformanceChart weekly={data.weekly} />
              </div>
              <div className="xl:col-span-4">
                <RecentActivityCard rounds={data.recent} />
              </div>
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
