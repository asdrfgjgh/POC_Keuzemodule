// /server/api/users/[id]/favorite.patch.ts

import connectDB from '../../../utils/db';
import UserModel from '../../../models/User';
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

    const User = UserModel as unknown as Model<any>;
    
    // Haal de request body op
    const body = await readBody(event);
    const { moduleId } = body;

    if (!moduleId) {
      setResponseStatus(event, 400);
      return { error: 'Module ID ontbreekt in request body.' };
    }

    // Zoek de gebruiker
    const user = await User.findById(userId);
    
    if (!user) {
      setResponseStatus(event, 404);
      return { error: 'Gebruiker niet gevonden.' };
    }

    // Zorg ervoor dat favoriteModules een array is
    if (!Array.isArray(user.favoriteModules)) {
      user.favoriteModules = [];
    }

    // Controleer of de module al een favoriet is
    const isFavorite = user.favoriteModules.includes(moduleId);
    
    if (isFavorite) {
      // Verwijder uit favorieten
      user.favoriteModules = user.favoriteModules.filter((id: string) => id !== moduleId);
    } else {
      // Voeg toe aan favorieten
      user.favoriteModules.push(moduleId);
    }

    await user.save();

    return {
      message: isFavorite ? 'Favoriet verwijderd' : 'Favoriet toegevoegd',
      isNowFavorite: !isFavorite,
      user: {
        name: user.name || 'Onbekende gebruiker',
        favoriteModules: user.favoriteModules
      }
    };

  } catch (error) {
    console.error(`Fout bij togglen van favoriet voor gebruiker ${userId}:`, error);
    setResponseStatus(event, 500);
    return {
      error: 'Kon de favoriet niet togglen.',
      details: (error as Error).message
    };
  }
});
