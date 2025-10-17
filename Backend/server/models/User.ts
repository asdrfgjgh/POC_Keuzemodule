// ~/server/models/User.js (Het AANGEPASTE bestand)

import pkg from 'mongoose'; 
const { Schema, model, models } = pkg; 

// 1. AANGEPASTE INTERFACE
export interface IUser extends pkg.Document { // Gebruik pkg.Document i.p.v. mongoose.Document
  name: string;
  studentNumber: string;
  // ✅ TOEGEVOEGD: Het favorietenveld
  favoriteModules: string[]; 
}

// 2. AANGEPAST SCHEMA
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  studentNumber: { type: String, required: true, unique: true },
  
  // ✅ TOEGEVOEGD: Definitie van de array
  favoriteModules: { 
    type: [String], // Array van strings
    default: []     // Zorg dat het altijd bestaat
  },
});

// 3. MODEL CREATIE (Gebruik de gedestructureerde 'models' en 'model')
const UserModel = models.User || model<IUser>('User', UserSchema);

export default UserModel;