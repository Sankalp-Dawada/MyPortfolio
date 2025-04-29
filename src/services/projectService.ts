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
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const prompt = `
      Analyze the following source code and generate a concise description of what the project does.
      Focus on functionality, purpose, and avoid repeating the code.

      Code:
      ${fileContent}
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
            role: 'user'
          }
        ]
      })
    });

    const result = await response.json();

    if (result.candidates && result.candidates.length > 0) {
      return result.candidates[0].content.parts[0].text;
    } else {
      console.error('No description candidates returned from Gemini:', result);
      return "No description could be generated.";
    }
  } catch (error) {
    console.error('Error generating description via Gemini API:', error);
    return "Failed to generate description. Please enter manually.";
  }
};
