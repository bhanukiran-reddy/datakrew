import Hero from './components/hero/page';
import LogisticsAnimationSection from './components/LogisticsAnimationSection';
import DeepTech from './components/deeptech/page';
import Parterners from './components/parterners/page';


export default function Home() {
  return (
  <div>
  <Hero />
  <Parterners />
  {/* <LogisticsAnimationSection /> */}
  <DeepTech />
  </div>
  )
}
