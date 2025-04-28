import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface CertificateCardProps {
  id: string;
  imageurl: string;
  isAuthenticated: boolean;
  onDelete: (id: string) => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ id, imageurl, isAuthenticated, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      onDelete(id);
    }
  };

  const fallbackImage = 'https://images.pexels.com/photos/519922/pexels-photo-519922.jpeg?auto=compress&cs=tinysrgb&w=600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden relative"
    >
      <div className="relative overflow-auto h-64 p-2">
        <img
          src={imageurl || fallbackImage}
          alt="Certificate"
          className="w-full h-auto object-contain transition-transform hover:scale-105 duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />
      </div>

      {isAuthenticated && (
        <div className="absolute top-2 right-2">
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete certificate"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CertificateCard;
