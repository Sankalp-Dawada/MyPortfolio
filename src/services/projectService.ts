import { v4 as uuidv4 } from 'uuid';
import { db } from './firebase';
import { Project } from '../types';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';

const PROJECT_COLLECTION = 'projects';

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, PROJECT_COLLECTION);
    const projectsQuery = query(projectsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(projectsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  } catch (error) {
    console.error('Error fetching projects from Firestore:', error);
    return [];
  }
};

export const addProject = async (projectData: Omit<Project, 'id' | 'createdAt'>): Promise<Project | null> => {
  try {
    const newProject = {
      ...projectData,
      createdAt: Date.now()
    };
    const docRef = await addDoc(collection(db, PROJECT_COLLECTION), newProject);
    return { id: docRef.id, ...newProject };
  } catch (error) {
    console.error('Error adding project to Firestore:', error);
    return null;
  }
};

export const deleteProject = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, PROJECT_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting project from Firestore:', error);
    return false;
  }
};

export const searchProjects = async (queryStr: string): Promise<Project[]> => {
  try {
    const allProjects = await getProjects();
    const lowerQuery = queryStr.toLowerCase();
    return allProjects.filter(project =>
      project.title.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching projects:', error);
    return [];
  }
};

export const generateProjectDescription = async (fileContent: string): Promise<string> => {
  try {
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    if (lines.length === 0) {
      return "This project doesn't have a description yet.";
    }

    const commentBlockLines = [];
    let inCommentBlock = false;

    for (const line of lines.slice(0, 20)) {
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
