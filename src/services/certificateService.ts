import { v4 as uuidv4 } from 'uuid';
import { db } from './firebase';
import { Certificate } from '../types';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';

const CERTIFICATE_COLLECTION = 'certificates';

export const getCertificates = async (): Promise<Certificate[]> => {
  try {
    const certsRef = collection(db, CERTIFICATE_COLLECTION);
    const certsQuery = query(certsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(certsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate));
  } catch (error) {
    console.error('Error fetching certificates from Firestore:', error);
    return [];
  }
};

export const addCertificate = async (certData: Omit<Certificate, 'id' | 'createdAt'>): Promise<Certificate | null> => {
  try {
    const newCertificate = {
      ...certData,
      createdAt: Date.now()
    };
    const docRef = await addDoc(collection(db, CERTIFICATE_COLLECTION), newCertificate);
    return { id: docRef.id, ...newCertificate };
  } catch (error) {
    console.error('Error adding certificate to Firestore:', error);
    return null;
  }
};

export const deleteCertificate = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, CERTIFICATE_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting certificate from Firestore:', error);
    return false;
  }
};

export const searchCertificates = async (queryStr: string): Promise<Certificate[]> => {
  try {
    const allCerts = await getCertificates();
    const lowerQuery = queryStr.toLowerCase();
    return allCerts.filter(cert =>
      cert.title.toLowerCase().includes(lowerQuery) ||
      cert.description.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching certificates:', error);
    return [];
  }
};

export const generateCertificateDescription = async (fileContent: string): Promise<string> => {
  try {
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');

    if (lines.length === 0) {
      return "This certificate does not have a description yet.";
    }

    const firstFewLines = lines.slice(0, 5).join(' ');
    return `Certificate related to ${firstFewLines.substring(0, 200)}...`;

  } catch (error) {
    console.error('Error generating certificate description:', error);
    return "Failed to generate description. Please enter manually.";
  }
};
