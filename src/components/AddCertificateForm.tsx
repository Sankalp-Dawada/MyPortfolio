import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Loader } from 'lucide-react';
import { addCertificate } from '../services/certificateService'; 
interface AddCertificateFormProps {
  onCertificateAdded: () => void;
}

const AddCertificateForm: React.FC<AddCertificateFormProps> = ({ onCertificateAdded }) => {
  const [certificateTitle, setCertificateTitle] = useState('');
  const [certificateDescription, setCertificateDescription] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [certificateDate, setCertificateDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateTitle.trim() || !certificateDescription.trim() || !certificateUrl.trim() || !certificateDate.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addCertificate({ 
        title: certificateTitle, 
        description: certificateDescription, 
        imageurl: certificateUrl, 
        date: certificateDate, 
        issuedBy: 'Unknown' 
      });
      setCertificateTitle('');
      setCertificateDescription('');
      setCertificateUrl('');
      setCertificateDate('');
      onCertificateAdded();
    } catch (err) {
      console.error('Error adding certificate:', err);
      setError('Failed to add certificate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Add Certificate</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start">
          <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Certificate Title*
          </label>
          <input
            type="text"
            value={certificateTitle}
            onChange={(e) => setCertificateTitle(e.target.value)}
            placeholder="Certificate Title"
            className="block w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Certificate Description*
          </label>
          <textarea
            value={certificateDescription}
            onChange={(e) => setCertificateDescription(e.target.value)}
            placeholder="Certificate Description"
            className="block w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Certificate URL*
          </label>
          <input
            type="url"
            value={certificateUrl}
            onChange={(e) => setCertificateUrl(e.target.value)}
            placeholder="https://example.com/certificate"
            className="block w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Certificate Date*
          </label>
          <input
            type="date"
            value={certificateDate}
            onChange={(e) => setCertificateDate(e.target.value)}
            className="block w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 dark:bg-slate-700 dark:text-white"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader size={18} className="animate-spin mr-2" />
                Adding...
              </>
            ) : (
              'Add Certificate'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddCertificateForm;
