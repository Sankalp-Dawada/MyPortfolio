import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProjectList from '../components/ProjectList';
import CertificateList from '../components/CertificateList'; 
import FloatingActionButton from '../components/FloatingActionButton';
import Footer from '../components/Footer';
import { getProjects, deleteProject, searchProjects } from '../services/projectService';
import { getCertificates, deleteCertificate, searchCertificates } from '../services/certificateService'; 
import { Project, Certificate } from '../types';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      const loadedProjects = await getProjects();
      const loadedCertificates = await getCertificates();

      setProjects(sortByDate(loadedProjects));
      setCertificates(sortByDate(loadedCertificates));
    };

    loadContent();

    window.addEventListener('storage', loadContent);
    return () => window.removeEventListener('storage', loadContent);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setProjects(sortByDate(await getProjects()));
      setCertificates(sortByDate(await getCertificates()));
    } else {
      setProjects(sortByDate(await searchProjects(query)));
      setCertificates(sortByDate(await searchCertificates(query)));
    }
  };

  const handleDeleteProject = (id: string) => {
    const success = deleteProject(id);
    if (success) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleDeleteCertificate = (id: string) => {
    const success = deleteCertificate(id);
    if (success) {
      setCertificates(prev => prev.filter(c => c.id !== id));
    }
  };

  const sortByDate = <T extends { date: string }>(items: T[]): T[] => {
    return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
      <Header onSearch={handleSearch} />
      <main className="flex-grow">
        <section id="about">
          <Hero />
        </section>

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-24 py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                My Projects
              </h2>
              {searchQuery && (
                <p className="text-slate-600 dark:text-slate-400">
                  Showing project results for "{searchQuery}"
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

        {/* Certificates Section */}
        <section id="certificates" className="scroll-mt-24 py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                My Certificates
              </h2>
              {searchQuery && (
                <p className="text-slate-600 dark:text-slate-400">
                  Showing certificate results for "{searchQuery}"
                </p>
              )}
            </div>

            <CertificateList
              certificates={certificates}
              isAuthenticated={isAuthenticated}
              onDelete={handleDeleteCertificate}
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
