import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, ExternalLink } from 'lucide-react';
import { Certificate } from '../types';

interface CertificateCardProps {
  certificate: Certificate;
  isAuthenticated: boolean;
  onDelete: (id: string) => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, isAuthenticated, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this certificate?')) {
      onDelete(certificate.id);
    }
  };

  const fallbackImage = 'https://images.pexels.com/photos/326576/pexels-photo-326576.jpeg?auto=compress&cs=tinysrgb&w=800';

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
          src={certificate.imageUrl || fallbackImage}
          alt={`${certificate.title} preview`}
          className="w-full h-full object-cover object-center transition-transform hover:scale-105 duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />
        <div className="absolute top-0 right-0 m-2">
          <span className="inline-block bg-slate-900/70 text-xs text-white px-2 py-1 rounded">
            {certificate.date}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {certificate.title}
          </h3>
          {isAuthenticated && (
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="Delete certificate"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
          {certificate.description}
        </p>

        <div className="flex justify-end">
          {certificate.credentialUrl && (
            <a
              href={certificate.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-medium transition-colors"
            >
              <ExternalLink size={16} className="mr-1" />
              <span>View Certificate</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateCard;
