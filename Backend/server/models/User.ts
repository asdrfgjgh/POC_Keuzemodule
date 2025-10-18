// ~/server/models/User.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. AANGEPASTE INTERFACE
export interface IUser extends Document {
  name: string;
  studentNumber: string;
  favoriteModules: string[]; 
}

// 2. AANGEPAST SCHEMA
const UserSchema: Schema<IUser> = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  studentNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  favoriteModules: { 
    type: [String], 
    default: []     
  },
}, {
  timestamps: true
});

// 3. MODEL CREATIE
export const UserModel: Model<IUser> = 
  (mongoose.models.User as Model<IUser>) || 
  mongoose.model<IUser>('User', UserSchema);

export default UserModel;