import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    throw error;
  }
};

export const updateUserProfile = async (uid, updateData) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...updateData,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};
