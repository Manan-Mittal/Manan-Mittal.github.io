
import { ArrowDownCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import PixelArt from './PixelArt';
import PixelCoffeeWithSteam from './PixelCoffeeWithSteam';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section 
      id="home" 
      className="min-h-screen pt-16 sm:pt-20 relative flex items-center"
      style={{ background: '#fbf9f6' }}
    >
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-start justify-center">
        <div className={`w-full max-w-3xl transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block px-4 py-1 mb-4 bg-coffee/10 rounded-full border border-coffee/20">
            <p className="text-coffee-dark text-sm font-medium">Software Engineer & Coffee Enthusiast</p>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-coffee-black">
              <span className="block sm:inline">Hi, I'm </span> <span className="text-coffee">Manan Mittal</span>
            </h1>
            <div className="hidden sm:block">
              <PixelCoffeeWithSteam />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <PixelArt variant="code" className="w-16 h-16 sm:w-auto sm:h-auto" />
            <PixelArt variant="coffee" className="w-16 h-16 sm:w-auto sm:h-auto" />
            <PixelArt variant="plant" className="w-16 h-16 sm:w-auto sm:h-auto hidden sm:block" />
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl text-balance">
            Software Engineer at Deloitte blending tech expertise with a passion for coffee. 
            Creator of 'To Be Continued', an Asian American-inspired coffee pop-up.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  window.scrollTo({
                    top: aboutSection.offsetTop - 80,
                    behavior: 'smooth'
                  });
                }
              }}
              className="bg-coffee text-cream-light px-6 py-3 rounded-md font-medium shadow-sm hover:bg-coffee-dark transition-all duration-200"
            >
              About Me
            </button>
            
            <button 
              onClick={() => {
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                  window.scrollTo({
                    top: projectsSection.offsetTop - 80,
                    behavior: 'smooth'
                  });
                }
              }}
              className="border border-coffee bg-transparent text-coffee-dark px-6 py-3 rounded-md font-medium hover:bg-coffee/10 transition-all duration-200"
            >
              View Projects
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDownCircle size={28} className="text-coffee opacity-70" />
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
