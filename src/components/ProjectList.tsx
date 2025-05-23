import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { Project } from '../types';

interface ProjectListProps {
  projects: Project[];
  isAuthenticated: boolean;
  onDelete: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, isAuthenticated, onDelete }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          No projects found. {isAuthenticated && 'Add a new project to get started!'}
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectCard
              project={project}
              isAuthenticated={isAuthenticated}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default ProjectList;