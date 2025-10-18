// /server/api/users/[id].get.ts

import connectDB from '../../utils/db';
import UserModel, { IUser } from '../../models/User';
import type { Model } from 'mongoose';
import { setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id;

  if (!userId) {
    setResponseStatus(event, 400);
    return { error: 'User ID ontbreekt.' };
  }

  try {
    await connectDB();

    const User = UserModel as Model<IUser>;
    
    // Zoek de gebruiker
    const user = await User.findById(userId).lean();
    
    if (!user) {
      setResponseStatus(event, 404);
      return { error: 'Gebruiker niet gevonden.' };
    }

    // Veiligheidschecks voor de user properties
    return {
      _id: user._id || userId,
      name: user.name || 'Onbekende gebruiker',
      studentNumber: user.studentNumber || 'N/A',
      favoriteModules: Array.isArray(user.favoriteModules) ? user.favoriteModules : []
    };

  } catch (error) {
    console.error(`Fout bij ophalen van gebruiker ${userId}:`, error);
    setResponseStatus(event, 500);
    return {
      error: 'Kon de gebruiker niet ophalen.',
      details: (error as Error).message
    };
  }
});
