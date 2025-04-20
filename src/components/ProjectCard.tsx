import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Trash2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  isAuthenticated: boolean;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isAuthenticated, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      onDelete(project.id);
    }
  };

  // Fallback image if the project image is not available
  const fallbackImage = 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
    >
      <div className="relative overflow-hidden h-48">
        <img 
          src={project.imageUrl || fallbackImage} 
          alt={`${project.title} screenshot`}
          className="w-full h-full object-cover object-center transition-transform hover:scale-105 duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />
        <div className="absolute top-0 right-0 m-2">
          <span className="inline-block bg-slate-900/70 text-xs text-white px-2 py-1 rounded">
            {project.date}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {project.title}
          </h3>
          {isAuthenticated && (
            <button 
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Delete project"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="flex justify-between items-center">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-medium transition-colors"
          >
            <Github size={16} className="mr-1" />
            <span>View Code</span>
          </a>
          
          {/* If you have a demo link, you can add it here */}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            <ExternalLink size={16} className="mr-1" />
            <span>Live Demo</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;