// src/services/projectService.ts

import { v4 as uuidv4 } from 'uuid';
import { Project } from '../types';

// Local storage key for projects
const PROJECTS_STORAGE_KEY = 'portfolio_projects';

// Get all projects from local storage
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

// Add a new project
export const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>): Project => {
  const newProject: Project = {
    id: uuidv4(),
    ...projectData,
    createdAt: Date.now()
  };
  
  const projects = getProjects();
  projects.unshift(newProject); // Add new project to beginning of array
  
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  
  // Trigger storage event for other tabs
  window.dispatchEvent(new Event('storage'));
  
  return newProject;
};

// Delete a project by id
export const deleteProject = (id: string): boolean => {
  const projects = getProjects();
  const filteredProjects = projects.filter(project => project.id !== id);
  
  if (filteredProjects.length === projects.length) {
    return false; // No project was deleted
  }
  
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filteredProjects));
  
  // Trigger storage event for other tabs
  window.dispatchEvent(new Event('storage'));
  
  return true;
};

// Search projects by title or description
export const searchProjects = (query: string): Project[] => {
  const projects = getProjects();
  const lowercasedQuery = query.toLowerCase();
  
  return projects.filter(project => 
    project.title.toLowerCase().includes(lowercasedQuery) || 
    project.description.toLowerCase().includes(lowercasedQuery)
  );
};

// Generate project description using first few lines of the file content
export const generateProjectDescription = async (fileContent: string): Promise<string> => {
  // In a real app, this would call an AI service or API
  // For now, we'll simulate by extracting content from the file
  try {
    // Extract first few lines or a chunk of text for the description
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      return "This project doesn't have a description yet.";
    }
    
    // Find the first comment block if it exists (often contains project description)
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
        
        // Clean up comment symbols
        const cleanedLine = line.replace(/^\s*\*\s*/, '').trim();
        if (cleanedLine) {
          commentBlockLines.push(cleanedLine);
        }
      }
    }
    
    if (commentBlockLines.length > 0) {
      return commentBlockLines.join(' ');
    }
    
    // If no comment block found, extract first few non-empty lines
    const firstFewLines = lines.slice(0, 5).join(' ');
    return `Project based on ${firstFewLines.substring(0, 200)}...`;
    
  } catch (error) {
    console.error('Error generating description:', error);
    return "Failed to generate description. Please enter manually.";
  }
};