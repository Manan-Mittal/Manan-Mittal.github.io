import SceneLayer from '@/components/site/SceneLayer';
import TopBar from '@/components/site/TopBar';
import Hero from '@/components/site/Hero';
import About from '@/components/site/About';
import Work from '@/components/site/Work';
import Projects from '@/components/site/Projects';
import PopUp from '@/components/site/PopUp';
import Contact from '@/components/site/Contact';
import Footer from '@/components/site/Footer';

const Index = () => (
  <div className="relative min-h-screen bg-roast-950">
    <SceneLayer />
    <TopBar />

    <main className="relative z-10">
      <Hero />
      <About />
      <Work />
      <Projects />
      <PopUp />
      <Contact />
    </main>

    <div className="relative z-10">
      <Footer />
    </div>
  </div>
);

export default Index;
