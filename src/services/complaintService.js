import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  updateDoc 
} from "firebase/firestore";
import { db } from "../firebase/config";

export const CATEGORIES = [
  "Water",
  "Electricity",
  "Roads",
  "Sanitation",
  "Agriculture",
  "Health",
  "Education",
  "Other"
];

export const STATUS_OPTIONS = [
  "Pending",
  "Under Review",
  "In Progress",
  "Resolved"
];

export const createComplaint = async (complaintData) => {
  try {
    const payload = {
      title: complaintData.title || "",
      description: complaintData.description || "",
      category: complaintData.category || "Other",
      village: complaintData.village || "",
      priority: complaintData.priority || "Medium",
      imageUrl: complaintData.imageUrl || "",
      status: "Pending",
      createdBy: complaintData.createdBy,
      creatorName: complaintData.creatorName || "Citizen",
      creatorMobile: complaintData.creatorMobile || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "complaints"), payload);
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error("Error creating complaint:", error);
    throw error;
  }
};

export const getUserComplaints = async (userId) => {
  try {
    const q = query(
      collection(db, "complaints"),
      where("createdBy", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const complaints = [];
    querySnapshot.forEach((docSnap) => {
      complaints.push({ id: docSnap.id, ...docSnap.data() });
    });
    // Sort in memory to avoid index requirements
    complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return complaints;
  } catch (error) {
    console.error("Error getting user complaints:", error);
    throw error;
  }
};

export const getAllComplaints = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "complaints"));
    const complaints = [];
    querySnapshot.forEach((docSnap) => {
      complaints.push({ id: docSnap.id, ...docSnap.data() });
    });
    complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return complaints;
  } catch (error) {
    console.error("Error getting all complaints:", error);
    throw error;
  }
};

export const getComplaintById = async (id) => {
  try {
    const docRef = doc(db, "complaints", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting complaint by ID:", error);
    throw error;
  }
};

export const updateComplaintStatus = async (id, status) => {
  try {
    const docRef = doc(db, "complaints", id);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error updating complaint status:", error);
    throw error;
  }
};

export const addAdminReply = async (complaintId, replyData) => {
  try {
    const payload = {
      complaintId,
      adminId: replyData.adminId,
      adminName: replyData.adminName || "Administrator",
      message: replyData.message,
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "adminReplies"), payload);
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error("Error adding admin reply:", error);
    throw error;
  }
};

export const getAdminReplies = async (complaintId) => {
  try {
    const q = query(
      collection(db, "adminReplies"),
      where("complaintId", "==", complaintId)
    );
    const querySnapshot = await getDocs(q);
    const replies = [];
    querySnapshot.forEach((docSnap) => {
      replies.push({ id: docSnap.id, ...docSnap.data() });
    });
    replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return replies;
  } catch (error) {
    console.error("Error getting admin replies:", error);
    return [];
  }
};

export const createSuggestion = async (suggestionData) => {
  try {
    const payload = {
      title: suggestionData.title,
      description: suggestionData.description,
      createdBy: suggestionData.createdBy,
      creatorName: suggestionData.creatorName || "Citizen",
      village: suggestionData.village || "",
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "suggestions"), payload);
    return { id: docRef.id, ...payload };
  } catch (error) {
    console.error("Error creating suggestion:", error);
    throw error;
  }
};

export const getUserSuggestions = async (userId) => {
  try {
    const q = query(
      collection(db, "suggestions"),
      where("createdBy", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const suggestions = [];
    querySnapshot.forEach((docSnap) => {
      suggestions.push({ id: docSnap.id, ...docSnap.data() });
    });
    suggestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return suggestions;
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return [];
  }
};
