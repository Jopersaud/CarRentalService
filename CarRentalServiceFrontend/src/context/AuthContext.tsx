import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser, // Rename Firebase's User to avoid naming conflicts
} from "firebase/auth";
import { app } from "../firebase.ts"; // Ensure this path is correct
import type { AuthContextType, RegisterData, users } from "../types/Index"; // Use 'User' type

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get the Firebase auth instance
const auth = getAuth(app);

// Your Node.js backend URL - CORRECTED PORT
const API_URL = 'http://localhost:8000/api';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<users | null>(null); // Use 'User' type
  const [loading, setLoading] = useState(true);

  // This effect listens for real-time changes to the user's login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Authentication Functions ---

  const login = async (email: string, password: string): Promise<boolean> => {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // --- THIS IS THE FIX ---
    // The userData object already has firstName, lastName, email, and password.
    // We can send it directly to the backend without any modification.
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData), // Send the userData object directly
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed on the server.");
    }
    
    // After successful backend registration, log the new user in on the client.
    await signInWithEmailAndPassword(auth, userData.email, userData.password);
    return true;
  };

  const logout = () => {
    signOut(auth);
  };
  
  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily access the auth context in any component
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

