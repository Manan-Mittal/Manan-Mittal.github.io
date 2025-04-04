
import { Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({
        name: '',
        email: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1000);
  };
  
  return (
    <section id="contact" className="py-20 md:py-32 bg-coffee/5 relative">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent"></div>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mx-auto mb-4">Let's Connect</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Have a project in mind or just want to chat? Feel free to reach out!
          </p>
          
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-6">
            <div className="card-coffee">
                <div className="flex items-start">
                  <div className="bg-coffee/10 p-2 rounded-md mr-4">
                    <Mail size={20} className="text-coffee" />
                  </div>
                  <div>
                    <h3 className="font-medium text-coffee-dark mb-1">Email</h3>
                    <a href="mailto:manan.mittal2020@gmail.com" className="text-muted-foreground hover:text-coffee transition-colors">
                      manan.mittal2020@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              
              
              <div className="card-coffee">
                <div className="flex items-start">
                  <div className="bg-coffee/10 p-2 rounded-md mr-4">
                    <MapPin size={20} className="text-coffee" />
                  </div>
                  <div>
                    <h3 className="font-medium text-coffee-dark mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      Virginia
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="card-coffee">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-coffee-dark mb-1 font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formState.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border border-cream-dark/30 bg-cream-light focus:outline-none focus:ring-2 focus:ring-coffee/50"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-coffee-dark mb-1 font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formState.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md border border-cream-dark/30 bg-cream-light focus:outline-none focus:ring-2 focus:ring-coffee/50"
                      placeholder="Your email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-coffee-dark mb-1 font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formState.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-2 rounded-md border border-cream-dark/30 bg-cream-light focus:outline-none focus:ring-2 focus:ring-coffee/50"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting || isSubmitted}
                      className={`w-full py-3 px-6 rounded-md flex items-center justify-center font-medium transition-all duration-200 ${
                        isSubmitted 
                          ? 'bg-sage text-white' 
                          : 'bg-coffee text-cream-light hover:bg-coffee-dark'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-cream-light" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : isSubmitted ? (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Message Sent!
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Send size={18} className="mr-2" />
                          Send Message
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
