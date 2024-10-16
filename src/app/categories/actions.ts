"use server";

import { db, storage } from "@/lib/firebaseClient";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Subcategory } from "@/types/types";

// creates a new subcategory with the provided form data
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

// updates an existing subcategory with new data
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

// deletes a subcategory by ID
export async function deleteSubcategory(id: string): Promise<void> {
  try {
    const subcategoryRef = doc(db, "subcategories", id);
    await deleteDoc(subcategoryRef);
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    throw new Error("Failed to delete subcategory");
  }
}

// renames all subcategories under the specified category
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

// deletes all subcategories under the specified category
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
