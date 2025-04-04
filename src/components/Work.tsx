
import { Briefcase, Calendar, ArrowRight, GraduationCap, Coffee, Code } from 'lucide-react';
import { useState } from 'react';

const Work = () => {
  const [activeJob, setActiveJob] = useState(0);
  
  const jobs = [
    {
      title: "Software Engineer",
      company: "Deloitte",
      period: "July 2024 – Current",
      description: "Working with talented people on a VHA supply chain project",
      achievements: [
        "",
        "Applying software engineering principles to deliver client solutions",
        "Collaborating with cross-functional teams on technology implementations"
      ],
      icon: <Code size={20} />
    },
    {
      title: "Software Engineering Intern",
      company: "Deloitte",
      period: "June 2023 – August 2023",
      description: "Worked on an FDA project, focusing on software development and data analysis.",
      achievements: [
        "Worked on full-stack development projects using modern web technologies",
        "Collaborated with team members to implement and test new features",
        "Participated in agile development processes and client meetings",
        "Gained experience in enterprise-level application development"
      ],
      icon: <Briefcase size={20} />
    },
    {
      title: "Software Engineering Intern",
      company: "Mphasis",
      period: "July 2022 – September 2022",
      description: "Worked on a Fincen project, building the future of cognitive based data engines.",
      achievements: [
        "Developed web applications using JavaScript and related frameworks",
        "Contributed to backend development and API integration",
        "Participated in code reviews and testing procedures",
        "Gained hands-on experience in professional software development"
      ],
      icon: <Briefcase size={20} />
    },
    {
      title: "To Be Continued",
      company: "Coffee Pop-up",
      period: "Ongoing",
      description: "Co-Founder of 'To Be Continued', an Asian American-inspired coffee pop-up that provides a platform for the Asian American community.",
      achievements: [
        "Created unique Asian American-inspired coffee beverages",
        "Built a community platform celebrating Asian American culture",
        "Managed operations, marketing, and customer experience",
        "Balanced entrepreneurship with technical career development"
      ],
      icon: <Coffee size={20} />
    }
  ];
  
  return (
    <section id="work" className="py-16 sm:py-20 md:py-32 bg-cream/30 relative">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent"></div>
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="section-title">Work Experience</h2>
        
        <div className="mt-8 sm:mt-12 grid md:grid-cols-12 gap-6 md:gap-8">
          {/* Job Selection */}
          <div className="md:col-span-4 space-y-1">
            {jobs.map((job, index) => (
              <button
                key={index}
                onClick={() => setActiveJob(index)}
                className={`w-full text-left p-4 rounded-md transition-all duration-200 flex items-center ${
                  activeJob === index 
                    ? 'bg-coffee text-cream shadow-sm' 
                    : 'hover:bg-cream text-coffee-dark'
                }`}
              >
                <span className={`mr-3 ${activeJob === index ? 'text-cream-light' : 'text-coffee'}`}>
                  {job.icon}
                </span>
                <div>
                  <p className={`font-medium ${activeJob === index ? 'text-cream-light' : 'text-coffee-dark'}`}>
                    {job.title}
                  </p>
                  <p className={`text-sm ${activeJob === index ? 'text-cream-light/80' : 'text-muted-foreground'}`}>
                    {job.company}
                  </p>
                </div>
              </button>
            ))}
          </div>
          
          {/* Job Details */}
          <div className="md:col-span-8">
            <div className="card-coffee h-auto">
              <div className="flex items-center mb-4">
                <Calendar size={20} className="text-coffee mr-2 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">{jobs[activeJob].period}</span>
              </div>
              
              <h3 className="font-serif text-xl sm:text-2xl text-coffee-dark mb-2">
                {jobs[activeJob].title} <span className="text-coffee">@ {jobs[activeJob].company}</span>
              </h3>
              
              <p className="text-muted-foreground mb-6">{jobs[activeJob].description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Work;
