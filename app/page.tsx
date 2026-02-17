import Hero from './components/hero/page';
import LogisticsAnimationSection from './components/LogisticsAnimationSection';
import DeepTech from './components/deeptech/page';
import Parterners from './components/parterners/page';
import OutcomesSection from './components/cardFlotingSection/page';
import DataKrewVice from './components/dataKrewVice/page';
import BatterySection from './components/Battery/page';
import TestimonySection from './components/testimony/page';


export default function Home() {
  return (
  <div>
  <Hero />
  <Parterners />
  <LogisticsAnimationSection />
  <DeepTech />
  <OutcomesSection />
  <TestimonySection />
  <DataKrewVice />
  <BatterySection />

  </div>
  )
}
