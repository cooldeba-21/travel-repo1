import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

// User operations
export const createOrUpdateUser = async (
  userData: { uid: string; email?: string; displayName?: string; photoURL?: string },
  appId = "trav-ai-agent-local"
) => {
  const userRef = doc(db, `/artifacts/${appId}/users/${userData.uid}/profile`, "info");
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
    });
  } else {
    await updateDoc(userRef, {
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
    });
  }
};

export const getUserConsent = async (userId: string, appId = "trav-ai-agent-local") => {
  const userRef = doc(db, `/artifacts/${appId}/users/${userId}/profile`, "info");
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data().hasConsented || false;
  }
  return false;
};

export const updateUserConsent = async (userId: string, appId = "trav-ai-agent-local") => {
  const userRef = doc(db, `/artifacts/${appId}/users/${userId}/profile`, "info");
  await updateDoc(userRef, {
    hasConsented: true,
  });
};

// Trip operations
export const addTrip = async (
  tripData: { userId: string; [key: string]: any },
  appId = "trav-ai-agent-local"
) => {
  const tripRef = await addDoc(
    collection(db, `/artifacts/${appId}/users/${tripData.userId}/trips`),
    {
      ...tripData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
  return tripRef.id;
};

export const getUserTrips = async (userId: string, appId = "trav-ai-agent-local") => {
  const q = query(
    collection(db, `/artifacts/${appId}/users/${userId}/trips`),
    where("userId", "==", userId),
    orderBy("departureTime", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    departureTime: doc.data().departureTime?.toDate?.() || new Date(),
    arrivalTime: doc.data().arrivalTime?.toDate?.() || new Date(),
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
  }));
};
