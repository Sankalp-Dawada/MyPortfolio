export interface Project {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  githubUrl: string;
  createdAt: number;
}

export interface User {
  uid: string;
  email: string | null;
}