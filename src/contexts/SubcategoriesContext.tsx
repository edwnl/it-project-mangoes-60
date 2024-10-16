"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Subcategory } from "@/types/types";
import { db } from "@/lib/firebaseClient";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
  updateDoc,
} from "firebase/firestore";

interface SubcategoriesContextType {
  subcategories: Subcategory[];
  loading: boolean;
  error: string | null;
  updateSubcategory: (id: string, data: Partial<Subcategory>) => Promise<void>;
  createSubcategory: (data: Omit<Subcategory, "id">) => Promise<string>;
  deleteSubcategory: (id: string) => Promise<void>;
  getSubcategoryById: (id: string) => Subcategory;
}

const SubcategoriesContext = createContext<
  SubcategoriesContextType | undefined
>(undefined);

// context provider for managing subcategories data
export const SubcategoriesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // loads all subcategories from the Firestore collection on mount
  useEffect(() => {
    const subcategoriesCollection = collection(db, "subcategories");

    const unsubscribe = onSnapshot(
      subcategoriesCollection,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const updatedSubcategories = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as Subcategory,
        );
        setSubcategories(updatedSubcategories);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching subcategories:", err);
        setError("Failed to fetch subcategories");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // updates data of a subcategory by id
  const updateSubcategory = async (
    id: string,
    data: Partial<Subcategory>,
  ): Promise<void> => {
    try {
      const subcategoryRef = doc(db, "subcategories", id);
      await updateDoc(subcategoryRef, data);
    } catch (err) {
      console.error("Error updating subcategory:", err);
      throw new Error("Failed to update subcategory");
    }
  };

  // creates a new subcategory
  const createSubcategory = async (
    data: Omit<Subcategory, "id">,
  ): Promise<string> => {
    try {
      const subcategoriesCollection = collection(db, "subcategories");
      const docRef = await addDoc(subcategoriesCollection, data);
      return docRef.id;
    } catch (err) {
      console.error("Error creating subcategory:", err);
      throw new Error("Failed to create subcategory");
    }
  };

  // deletes a subcategory by ID
  const deleteSubcategory = async (id: string): Promise<void> => {
    try {
      const subcategoryRef = doc(db, "subcategories", id);
      await deleteDoc(subcategoryRef);
    } catch (err) {
      console.error("Error deleting subcategory:", err);
      throw new Error("Failed to delete subcategory");
    }
  };

  // fetches a subcategory by its ID
  const getSubcategoryById = (id: string): Subcategory => {
    const result = subcategories.find((subcategory) => subcategory.id === id);
    if (!result) throw new Error(`Cold not find subcategory with ID ${id}`);
    return result;
  };

  return (
    <SubcategoriesContext.Provider
      value={{
        subcategories,
        loading,
        error,
        updateSubcategory,
        createSubcategory,
        deleteSubcategory,
        getSubcategoryById,
      }}
    >
      {children}
    </SubcategoriesContext.Provider>
  );
};

export const useSubcategories = (): SubcategoriesContextType => {
  const context = useContext(SubcategoriesContext);
  if (context === undefined) {
    throw new Error(
      "useSubcategories must be used within a SubcategoriesProvider",
    );
  }
  return context;
};
