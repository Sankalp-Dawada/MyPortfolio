import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingActionButton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="fixed right-6 bottom-6 z-10"
    >
      <Link 
        to="/add-item-selection"
        className="flex items-center justify-center w-14 h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        aria-label="Add project"
      >
        <Plus size={24} />
      </Link>
    </motion.div>
  );
};

export default FloatingActionButton;