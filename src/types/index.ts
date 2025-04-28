export interface Project {
  id: string;
  title: string;
  date: string;
  description: string;
  imageurl: string;
  githubUrl: string;
  createdAt: number;
  liveDemoUrl?: string;
}

export interface User {
  uid: string;
  email: string | null;
}

export interface Certificate {
  id: string;
  title: string;
  description: string;
  date: string;
  imageurl: string;
  issuedBy: string;
  createdAt: number;
}