import { useEffect, useState, useContext, createContext } from "react";
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import {
  createOrUpdateUser,
  getUserConsent,
  updateUserConsent,
} from "../services/firestore"; // ✅ lowercase 'f'

// Define Auth context type
interface AuthContextType {
  user: User | null;
  consentGiven: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateConsent: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);
AuthContext.displayName = "AuthContext"; // ✅ helpful for debugging

// Hook to use auth
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

// Auth Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Save or update user profile in Firestore
        await createOrUpdateUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || "",
        });

        // Load consent status
        const consent = await getUserConsent(firebaseUser.uid);
        setConsentGiven(consent);
      } else {
        setConsentGiven(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google sign-in
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await createOrUpdateUser({
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
    });
  };

  // Email/password login
  const signInWithEmail = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await createOrUpdateUser({
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
    });
  };

  // Email/password sign-up
  const signUpWithEmail = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    await createOrUpdateUser({
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
    });
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  // Update consent
  const updateConsent = async () => {
    if (!user) return;
    await updateUserConsent(user.uid);
    setConsentGiven(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        consentGiven,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        updateConsent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
