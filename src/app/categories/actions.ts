"use server";

import { db, storage } from "@/lib/firebaseClient";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Subcategory } from "@/types/types";

export async function createSubcategory(formData: FormData): Promise<string> {
  try {
    const file = formData.get("file") as File;
    const fileName = `subcategories/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    const subcategory: Omit<Subcategory, "id"> = {
      subcategory_name: formData.get("name") as string,
      category_name: formData.get("category") as string,
      location: formData.get("location") as string,
      image_url: imageUrl,
    };

    const docRef = await addDoc(collection(db, "subcategories"), subcategory);
    return docRef.id;
  } catch (error) {
    console.error("Error creating subcategory:", error);
    throw new Error("Failed to create subcategory");
  }
}

export async function updateSubcategory(
  id: string,
  data: Partial<Subcategory>,
): Promise<void> {
  try {
    const subcategoryRef = doc(db, "subcategories", id);
    await updateDoc(subcategoryRef, data);
  } catch (error) {
    console.error("Error updating subcategory:", error);
    throw new Error("Failed to update subcategory");
  }
}

export async function deleteSubcategory(id: string): Promise<void> {
  try {
    const subcategoryRef = doc(db, "subcategories", id);
    await deleteDoc(subcategoryRef);
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw new Error("Failed to delete subcategory");
  }
}

export async function uploadImage(file: File): Promise<string> {
  try {
    const fileName = `subcategories/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

export async function renameCategory(
  oldName: string,
  newName: string,
): Promise<void> {
  const batch = writeBatch(db);
  const subcategoriesRef = collection(db, "subcategories");
  const q = query(subcategoriesRef, where("category_name", "==", oldName));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    batch.update(doc.ref, { category_name: newName });
  });

  await batch.commit();
}

export async function deleteCategory(categoryName: string): Promise<void> {
  const subcategoriesRef = collection(db, "subcategories");
  const q = query(subcategoriesRef, where("category_name", "==", categoryName));

  const querySnapshot = await getDocs(q);
  const batch = writeBatch(db);
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}
