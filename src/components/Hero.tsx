import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-20 pb-32 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Hi, I'm{' '}
            <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              Sankalp Dawada
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 mb-8"
          >
            A computer engineering student passionate about technology and innovation. I specialize in web
            development, app development, data science, and machine learning. My goal is to create impactful
            solutions that enhance user experiences and drive business success.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center space-x-4 mb-12"
          >
            <a
              href="https://github.com/Sankalp-Dawada"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 p-3 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/sankalp-dawada-578782321/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 p-3 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:sankalp.dawada@example.com"
              className="bg-slate-800 p-3 rounded-full hover:bg-slate-700 transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            onClick={scrollToProjects}
            className="animate-bounce inline-flex items-center text-slate-300 hover:text-white transition-colors"
            aria-label="Scroll to projects"
          >
            <span className="mr-2">View my work</span>
            <ChevronDown size={20} />
          </motion.button>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
    </section>
  );
};

export default Hero;