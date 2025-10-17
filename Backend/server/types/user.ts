// Bestand: ~/server/types/user.ts

// Definieer de structuur van een MongoDB User document
export interface User {
  _id: string; // MongoDB ID
  name: string;
  studentNumber: string;
  favoriteModules: string[];
  // Voeg hier andere velden toe uit je User Schema
  createdAt?: Date;
  updatedAt?: Date;
}