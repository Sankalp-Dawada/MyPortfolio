import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
      <Header onSearch={() => {}} />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-9xl font-bold text-teal-500 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white mb-6">
            Page Not Found
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;