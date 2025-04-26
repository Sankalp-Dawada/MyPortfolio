import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Award } from 'lucide-react';

const AddItemSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-10">
        What would you like to add?
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <button
          onClick={() => navigate('/add-project')}
          className="flex items-center gap-3 px-8 py-5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-lg text-xl font-semibold transition-all"
        >
          <PlusCircle size={28} />
          Add Project
        </button>

        <button
          onClick={() => navigate('/add-certificates')}
          className="flex items-center gap-3 px-8 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg text-xl font-semibold transition-all"
        >
          <Award size={28} />
          Add Certificate
        </button>
      </div>
    </div>
  );
};

export default AddItemSelection;
