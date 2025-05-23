import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import AddProjectForm from '../components/AddProjectForm';
import Footer from '../components/Footer';

const AddProjectPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page if not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Don't render anything while checking authentication status
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  // If not authenticated, we'll redirect in the useEffect
  // If authenticated, show the add project form
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      <Header onSearch={() => {}} />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            Add New Project
          </h1>
          
          <AddProjectForm onProjectAdded={() => navigate('/')} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddProjectPage;