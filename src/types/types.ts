import { firestore } from "firebase-admin";

export interface Subcategory {
  id: string;
  subcategory_name: string;
  category_name: string;
  image_url: string;
  location: string;
}

export interface SubcategoryResult extends Subcategory {
  confidence: number;
}

export interface UserData {
  email: string;
  name: string;
  role: "volunteer" | "admin";
  id: string;
  join_date: firestore.Timestamp;
}

export interface SearchHistory {
  results: SubcategoryResult[];
  image_url: string;
  prompt_response: string;
  category_filter_name: string;
  timestamp: firestore.FieldValue;
  user_id: string;
  correct_subcategory_id: string;
  scanned_quantity?: number;
  history_id?: string;
  user_data?: UserData;
}
