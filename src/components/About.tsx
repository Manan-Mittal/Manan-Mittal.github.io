
import { Code, Coffee, Heart, GraduationCap } from 'lucide-react';
import PixelArt from './PixelArt';

const About = () => {
  const skills = [
    "React", "TypeScript", "Node.js", "Express", 
    "MongoDB", "PostgreSQL", "GraphQL", "REST APIs", 
    "Redux", "Next.js", "Tailwind CSS", "Docker",
    "AWS", "CI/CD", "UI/UX Design", "Frontend Architecture", "GCP"
  ];

  return (
    <section id="about" className="py-16 sm:py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="section-title">About Me</h2>
            
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg">
                Hello! I'm Manan Mittal, a Software Engineer at Deloitte with a passion for creating 
                cool software and crafting unique beverages through my pop-up 'To Be Continued'.
              </p>
              
              <p>
                As a developer, I bring the same attention to detail and creativity to my code as I do to my coffee.
                I specialize in full-stack development, building applications that are both technically robust 
                and aesthetically-pleasing. I specialize in ml and data science, and I am always eager to learn new technologies and frameworks.
              </p>
              
              <div className="pt-4">
                <h3 className="font-serif text-xl text-coffee-dark mb-3">Education</h3>
                <div className="flex items-start">
                  <GraduationCap size={20} className="text-coffee mr-2 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Rutgers University, New Brunswick, NJ</p>
                    <p>B.S. in Computer Science, B.A. in Cognitive Science (Sep 2020 – May 2024)</p>
                    <p className="text-sm italic mt-1">Dean's List, Scarlet Scholarship, Rutgers College Scholarship, SAS Excellence Award</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-serif text-xl text-coffee-dark mb-3">Technical Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-cream px-3 py-1 rounded-full text-sm border border-cream-dark/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-4">
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-coffee/10 rounded-2xl transform -rotate-3"></div>
              <div className="absolute inset-0 bg-sage/20 rounded-2xl transform rotate-3"></div>
              <div className="relative bg-cream rounded-2xl overflow-hidden shadow-coffee border border-cream-dark/10 p-4 aspect-square flex items-center justify-center">
                <div className="w-full h-full rounded-xl bg-coffee-light/30 flex flex-col items-center justify-center gap-4">
                <img
                    src="src/components/images/IMG_9778.jpeg"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-cream p-4 rounded-lg shadow-soft border border-cream-dark/10 max-w-xs">
              <p className="font-serif text-coffee-dark text-sm italic">
                "Me in Quebec at a Microroasterie!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
