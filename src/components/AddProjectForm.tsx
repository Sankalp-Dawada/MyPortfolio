import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, AlertCircle, Loader } from 'lucide-react';
import { addProject, generateProjectDescription } from '../services/projectService';

interface AddProjectFormProps {
  onProjectAdded: () => void;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onProjectAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [imageurl, setimageurl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProjectFile(e.target.files[0]);
    }
  };

  const handleGenerateDescription = async () => {
    if (!projectFile) {
      setError('Please upload a project file to generate a description');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const fileContent = await readFileContent(projectFile);
      const generatedDescription = await generateProjectDescription(fileContent);
      setDescription(generatedDescription);
    } catch (error) {
      setError('Failed to generate description. Please try again.');
      console.error('Error generating description:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !date || !githubUrl) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      addProject({
        title,
        date,
        description,
        imageurl,
        githubUrl,
        liveDemoUrl,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setimageurl('');
      setGithubUrl('');
      setLiveDemoUrl('');
      setProjectFile(null);
      
      onProjectAdded();
    } catch (error) {
      setError('Failed to add project. Please try again.');
      console.error('Error adding project:', error);
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
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Add New Project</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start">
          <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Project Title*
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-700 dark:text-white"
              placeholder="My Awesome Project"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Date*
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-700 dark:text-white"
              placeholder="Jan 2024"
              required
            />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            GitHub URL*
          </label>
          <input
            id="githubUrl"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-700 dark:text-white"
            placeholder="https://github.com/yourusername/project"
            required
          />
        </div>

        <div className="space-y-2 mb-4">
          <label htmlFor="liveDemoUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Live Demo URL
          </label>
          <input
            id="liveDemoUrl"
            type="url"
            value={liveDemoUrl}
            onChange={(e) => setLiveDemoUrl(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-700 dark:text-white"
            placeholder="https://yourproject.com"
          />
          </div>

        <div className="space-y-2 mb-4">
          <label htmlFor="imageurl" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Image URL
          </label>
          <input
            id="imageurl"
            type="url"
            value={imageurl}
            onChange={(e) => setimageurl(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-700 dark:text-white"
            placeholder="https://example.com/project-image.jpg"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Add a URL to an image of your project. If left empty, a default image will be used.
          </p>
        </div>

        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Upload Project File (for AI Description)
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600 dark:text-slate-400">
                <label
                  htmlFor="projectFile"
                  className="relative cursor-pointer bg-white dark:bg-slate-700 rounded-md font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="projectFile"
                    name="projectFile"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept=".txt,.md,.js,.html,.css,.json,.py"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload a README, code file, or documentation
              </p>
              {projectFile && (
                <p className="text-sm text-teal-600 dark:text-teal-400">
                  {projectFile.name}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating || !projectFile}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                'Generate Description'
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Project Description*
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={10}
            cols={10}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-slate-700 dark:text-white"
            placeholder="Describe your project..."
            required
          ></textarea>
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
                Adding Project...
              </>
            ) : (
              'Add Project'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddProjectForm;