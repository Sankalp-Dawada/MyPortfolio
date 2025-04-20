import { v4 as uuidv4 } from 'uuid';
import { Project } from '../types';

const PROJECTS_STORAGE_KEY = 'portfolio_projects';

export const getProjects = (): Project[] => {
  const projectsJson = localStorage.getItem(PROJECTS_STORAGE_KEY);
  if (!projectsJson) return [];
  
  try {
    const projects = JSON.parse(projectsJson);
    return Array.isArray(projects) ? projects : [];
  } catch (error) {
    console.error('Error parsing projects from localStorage:', error);
    return [];
  }
};

export const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>): Project => {
  const newProject: Project = {
    id: uuidv4(),
    ...projectData,
    createdAt: Date.now()
  };
  
  const projects = getProjects();
  projects.unshift(newProject); 
  
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  
  window.dispatchEvent(new Event('storage'));
  
  return newProject;
};

export const deleteProject = (id: string): boolean => {
  const projects = getProjects();
  const filteredProjects = projects.filter(project => project.id !== id);
  
  if (filteredProjects.length === projects.length) {
    return false; 
  }
  
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filteredProjects));
  
  window.dispatchEvent(new Event('storage'));
  
  return true;
};

export const searchProjects = (query: string): Project[] => {
  const projects = getProjects();
  const lowercasedQuery = query.toLowerCase();
  
  return projects.filter(project => 
    project.title.toLowerCase().includes(lowercasedQuery) || 
    project.description.toLowerCase().includes(lowercasedQuery)
  );
};

export const generateProjectDescription = async (fileContent: string): Promise<string> => {

  try {
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      return "This project doesn't have a description yet.";
    }
    
    const commentBlockLines = [];
    let inCommentBlock = false;
    
    for (const line of lines.slice(0, 20)) { // Look at first 20 lines
      if (line.includes('/**') || line.includes('/*')) {
        inCommentBlock = true;
        continue;
      }
      
      if (inCommentBlock) {
        if (line.includes('*/')) {
          inCommentBlock = false;
          break;
        }
        
        const cleanedLine = line.replace(/^\s*\*\s*/, '').trim();
        if (cleanedLine) {
          commentBlockLines.push(cleanedLine);
        }
      }
    }
    
    if (commentBlockLines.length > 0) {
      return commentBlockLines.join(' ');
    }
    
    const firstFewLines = lines.slice(0, 5).join(' ');
    return `Project based on ${firstFewLines.substring(0, 200)}...`;
    
  } catch (error) {
    console.error('Error generating description:', error);
    return "Failed to generate description. Please enter manually.";
  }
};