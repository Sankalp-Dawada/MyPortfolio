import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, AlertCircle, Loader, X } from 'lucide-react';
import { addCertificate } from '../services/certificateService'; // You'll need to create this

interface AddCertificateFormProps {
  onCertificateAdded: () => void;
}

const AddCertificateForm: React.FC<AddCertificateFormProps> = ({ onCertificateAdded }) => {
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
      }
      setError('');
      setCertificateFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleClear = () => {
    setCertificateFile(null);
    setImageUrl('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateFile) {
      setError('Please upload a certificate image');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addCertificate(certificateFile); 
      handleClear();
      onCertificateAdded();
    } catch (err) {
      console.error('Error adding certificate:', err);
      setError('Failed to upload certificate. Please try again.');
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
            Upload Certificate Image*
          </label>

          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600 dark:text-slate-400">
                <label
                  htmlFor="certificateFile"
                  className="relative cursor-pointer bg-white dark:bg-slate-700 rounded-md font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="certificateFile"
                    name="certificateFile"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PNG, JPG, JPEG — up to 5MB
              </p>
              {certificateFile && (
                <p className="text-sm text-teal-600 dark:text-teal-400 mt-2">
                  {certificateFile.name}
                </p>
              )}
            </div>
          </div>

          {imageUrl && (
            <div className="relative mt-4 max-h-72 overflow-auto rounded-lg border border-slate-200 dark:border-slate-600">
              <img
                src={imageUrl}
                alt="Certificate Preview"
                className="w-full object-contain transition-transform hover:scale-105 duration-500"
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 bg-white/80 dark:bg-slate-800/80 rounded-full p-1 text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          )}
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
                Uploading...
              </>
            ) : (
              'Upload Certificate'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddCertificateForm;
