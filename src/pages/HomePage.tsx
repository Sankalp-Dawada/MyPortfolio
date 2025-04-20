import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProjectList from '../components/ProjectList';
import FloatingActionButton from '../components/FloatingActionButton';
import Footer from '../components/Footer';
import { getProjects, deleteProject, searchProjects } from '../services/projectService';
import { Project } from '../types';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load projects when the component mounts
    const loadProjects = () => {
      const allProjects = getProjects();
      setProjects(allProjects);
    };

    loadProjects();

    // Add event listener for storage changes (if another tab updates projects)
    window.addEventListener('storage', loadProjects);

    return () => {
      window.removeEventListener('storage', loadProjects);
    };
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setProjects(getProjects());
    } else {
      const filteredProjects = searchProjects(query);
      setProjects(filteredProjects);
    }
  };

  const handleDeleteProject = (id: string) => {
    const success = deleteProject(id);
    if (success) {
      setProjects(prev => prev.filter(project => project.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
      <Header onSearch={handleSearch} />
      
      <main className="flex-grow">
        <Hero />
        
        <section id="projects" className="py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                My Projects
              </h2>
              {searchQuery && (
                <p className="text-slate-600 dark:text-slate-400">
                  Showing results for "{searchQuery}"
                </p>
              )}
            </div>
            
            <ProjectList 
              projects={projects}
              isAuthenticated={isAuthenticated}
              onDelete={handleDeleteProject}
            />
          </div>
        </section>
      </main>
      
      {isAuthenticated && <FloatingActionButton />}
      
      <Footer />
    </div>
  );
};

export default HomePage;