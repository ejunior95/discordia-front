import { motion } from 'framer-motion';
import { HeroGreeting } from '@/features/home/components/HeroGreeting';
import { StatsOverview } from '@/features/home/components/StatsOverview';
import { LeaderboardCard } from '@/features/home/components/LeaderboardCard';
import { IAOfTheWeekCard } from '@/features/home/components/IAOfTheWeekCard';
import { PerformanceChart } from '@/features/home/components/PerformanceChart';
import { RecentActivityCard } from '@/features/home/components/RecentActivityCard';
import { QuickShortcuts } from '@/features/home/components/QuickShortcuts';
import { pageMotion } from '@/utils/pageMotion';

export default function Home() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <motion.div {...pageMotion} className="max-w-7xl mx-auto flex flex-col gap-5 md:gap-6">
        <HeroGreeting />

        <StatsOverview />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6">
          <div className="xl:col-span-6">
            <LeaderboardCard />
          </div>
          <div className="xl:col-span-6">
            <IAOfTheWeekCard />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6">
          <div className="xl:col-span-8">
            <PerformanceChart />
          </div>
          <div className="xl:col-span-4">
            <RecentActivityCard />
          </div>
        </div>

        <QuickShortcuts />
      </motion.div>
    </section>
  );
}
