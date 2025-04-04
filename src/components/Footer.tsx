
import { Coffee, Github, Linkedin, X, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="py-10 border-t border-cream-dark/20 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <Coffee size={22} className="text-coffee mr-2" />
            <span className="font-serif text-lg text-coffee-dark font-medium">
              Manan <span className="text-coffee">Mittal</span>
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-coffee transition-colors">About</a>
            <a href="#work" className="hover:text-coffee transition-colors">Experience</a>
            <a href="#projects" className="hover:text-coffee transition-colors">Projects</a>
            <a href="#contact" className="hover:text-coffee transition-colors">Contact</a>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Manan-Mittal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-coffee-dark transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/manan-mittal7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-coffee-dark transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-coffee-dark transition-colors"
              aria-label="Twitter"
            >
              <X size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Coffee size={16} className="text-coffee" />
            <p>© {new Date().getFullYear()} Manan Mittal. Software Engineer & Coffee Enthusiast.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="mailto:manan.mittal2020@gmail.com" className="hover:text-coffee transition-colors">
              manan.mittal2020@gmail.com
            </a>
            <span>|</span>
            <a href="tel:7326978114" className="hover:text-coffee transition-colors">
              732-697-8114
            </a>
          </div>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-coffee hover:text-coffee-dark transition-colors"
          >
            Back to top <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
