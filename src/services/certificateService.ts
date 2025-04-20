import { v4 as uuidv4 } from 'uuid';
import { Certificate } from '../types';

const CERTIFICATES_STORAGE_KEY = 'portfolio_certificates';

export const getCertificates = (): Certificate[] => {
  const certsJson = localStorage.getItem(CERTIFICATES_STORAGE_KEY);
  if (!certsJson) return [];

  try {
    const certificates = JSON.parse(certsJson);
    return Array.isArray(certificates) ? certificates : [];
  } catch (error) {
    console.error('Error parsing certificates from localStorage:', error);
    return [];
  }
};

export const addCertificate = (certData: Omit<Certificate, 'id' | 'createdAt'>): Certificate => {
  const newCertificate: Certificate = {
    id: uuidv4(),
    ...certData,
    createdAt: Date.now()
  };

  const certificates = getCertificates();
  certificates.unshift(newCertificate);

  localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(certificates));

  window.dispatchEvent(new Event('storage'));

  return newCertificate;
};

export const deleteCertificate = (id: string): boolean => {
  const certificates = getCertificates();
  const updatedCertificates = certificates.filter(cert => cert.id !== id);

  if (updatedCertificates.length === certificates.length) {
    return false;
  }

  localStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(updatedCertificates));

  window.dispatchEvent(new Event('storage'));

  return true;
};

export const searchCertificates = (query: string): Certificate[] => {
  const certificates = getCertificates();
  const lowerQuery = query.toLowerCase();

  return certificates.filter(cert =>
    cert.title.toLowerCase().includes(lowerQuery) ||
    cert.description.toLowerCase().includes(lowerQuery)
  );
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
