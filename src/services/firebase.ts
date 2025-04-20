import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { User } from '../types';

// Firebase configuration - replace with your actual config values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Map Firebase user to your User type
const mapFirebaseUser = (firebaseUser: any): User | null => {
  if (!firebaseUser) return null;
  
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email
  };
};

// Login with Admin credentials from Firestore
export const loginWithAdminFirestore = async (email: string, password: string): Promise<User | null> => {
  try {
    console.log('Attempting admin login with:', email);
    
    // Get reference to the admin document
    const adminDocRef = doc(db, 'Admin_login', 'Sankalp-Dawada');
    const adminDoc = await getDoc(adminDocRef);
    
    if (!adminDoc.exists()) {
      console.error('Admin document not found in Firestore');
      return null;
    }
    
    const adminData = adminDoc.data();
    console.log('Found admin document:', adminDoc.id);
    
    // Check if credentials match
    if (adminData.Email === email && adminData.Password === password) {
      console.log('Admin credentials verified successfully');
      
      // Create a user object with admin privileges
      return {
        uid: 'admin-' + adminDoc.id,
        email: adminData.Email,
        isAdmin: true
      };
    } else {
      console.error('Admin credentials do not match');
      return null;
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    return null;
  }
};

// Listen for authentication state changes
export const authStateListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    const user = mapFirebaseUser(firebaseUser);
    callback(user);
  });
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  // First check for admin user in session
  const adminUserJson = sessionStorage.getItem('adminUser');
  if (adminUserJson) {
    try {
      return JSON.parse(adminUserJson);
    } catch (error) {
      console.error('Error parsing admin user from session:', error);
    }
  }
  
  // If no admin user, check Firebase Auth
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribe();
      resolve(mapFirebaseUser(firebaseUser));
    });
  });
};

// Regular Firebase Auth login (as fallback)
export const loginWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUser(userCredential.user);
  } catch (error) {
    console.error('Firebase Auth login error:', error);
    return null;
  }
};

// Logout user
export const logoutUser = async (): Promise<boolean> => {
  try {
    // Clear admin session
    sessionStorage.removeItem('adminUser');
    
    // Sign out from Firebase Auth (if signed in)
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};