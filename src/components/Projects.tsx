
import { Code, ExternalLink, Github, Coffee, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import PixelArt from './PixelArt';

const Projects = () => {
  const [visibleProjects, setVisibleProjects] = useState(3);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  const projects = [
    {
      title: "To Be Continued Coffee",
      description: "An Asian American-inspired coffee pop-up providing unique beverages and a platform for the Asian American community.",
      tags: ["Entrepreneurship", "Coffee Culture", "Asian American", "Community Building"],
      icon: <Coffee className="w-10 h-10 text-coffee" />,
      repo: null,
      demo: "https://example.com"
    },
    {
      title: "Personal Portfolio",
      description: "A responsive, coffee-themed portfolio showcasing my full-stack development skills and coffee enthusiasm using modern web technologies.",
      tags: ["React", "Tailwind CSS", "TypeScript", "Vite"],
      icon: <PixelArt variant="coffee" className="w-10 h-10 text-coffee" />,
      repo: "https://github.com/manan",
      demo: "https://example.com"
    },
    {
      title: "Developer Toolkit",
      description: "A collection of utilities for developers including code formatting, API testing, and documentation generation.",
      tags: ["React", "Node.js", "Express", "MongoDB", "JWT"],
      icon: <Code className="w-10 h-10 text-coffee" />,
      repo: "https://github.com/manan",
      demo: "https://example.com"
    },
    {
      title: "Coffee Tasting Journal",
      description: "A mobile-first web app for coffee enthusiasts to track tastings with flavor profiles, rankings, and social sharing.",
      tags: ["Next.js", "Supabase", "TypeScript", "Prisma", "Vercel"],
      icon: <PixelArt variant="coffee" className="w-10 h-10 text-coffee" />,
      repo: "https://github.com/manan",
      demo: null
    },
    {
      title: "Social Media Dashboard",
      description: "A comprehensive dashboard for tracking and analyzing social media metrics across multiple platforms.",
      tags: ["React", "D3.js", "Node.js", "API Integration"],
      icon: <Globe className="w-10 h-10 text-coffee" />,
      repo: "https://github.com/manan",
      demo: "https://example.com"
    },
    {
      title: "Real-time Collaboration App",
      description: "A WebSocket-based platform for developers to collaborate on code and design projects in real-time.",
      tags: ["Socket.io", "React", "Redux", "Node.js", "MongoDB"],
      icon: <Code className="w-10 h-10 text-coffee" />,
      repo: "https://github.com/manan",
      demo: "https://example.com"
    }
  ];
  
  const showMoreProjects = () => {
    setVisibleProjects(projects.length);
  };
  
  return (
    <section id="projects" className="py-16 sm:py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title">Featured Projects</h2>
        <p className="text-muted-foreground max-w-2xl mb-8 sm:mb-12">
          A selection of my technical projects and entrepreneurial ventures, showcasing my skills
          in software development and my passion for coffee culture.
        </p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {projects.slice(0, visibleProjects).map((project, index) => (
            <div 
              key={index} 
              className={`card-coffee coffee-pour transition-all duration-500 opacity-0 translate-y-4 ${
                isLoaded ? 'opacity-100 translate-y-0' : ''
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-coffee/10 p-3 rounded-md">{project.icon}</div>
                <div className="flex gap-2">
                  {project.repo && (
                    <a href={project.repo} target="_blank" rel="noopener noreferrer" className="text-coffee hover:text-coffee-dark transition-colors" aria-label="GitHub Repository">
                      <Github size={20} />
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer" className="text-coffee hover:text-coffee-dark transition-colors" aria-label="Live Demo">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
              
              <h3 className="font-serif text-xl text-coffee-dark mb-2">{project.title}</h3>
              <p className="text-muted-foreground mb-6">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex} 
                    className="text-xs px-2 py-1 bg-coffee/10 text-coffee-dark rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {visibleProjects < projects.length && (
          <div className="mt-8 sm:mt-10 text-center">
            <button 
              onClick={showMoreProjects}
              className="bg-cream border border-coffee/20 text-coffee-dark px-6 py-3 rounded-md font-medium shadow-soft hover:bg-coffee hover:text-cream-light transition-all duration-200"
            >
              Show More Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
