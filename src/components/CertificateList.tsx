import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CertificateCard from './CertificateCard'; // Make sure this component exists
import { Certificate } from '../types';

interface CertificateListProps {
  certificates: Certificate[];
  isAuthenticated: boolean;
  onDelete: (id: string) => void;
}

const CertificateList: React.FC<CertificateListProps> = ({ certificates, isAuthenticated, onDelete }) => {
  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          No certificates found. {isAuthenticated && 'Add a new certificate to get started!'}
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <motion.div
            key={certificate.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CertificateCard
              certificate={certificate}
              isAuthenticated={isAuthenticated}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default CertificateList;
