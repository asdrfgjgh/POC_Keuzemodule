// /server/api/users/index.get.ts

import connectDB from '../../utils/db';
import UserModel from '../../models/User';
import type { Model } from 'mongoose';

export default defineEventHandler(async (event) => {
  console.log('>>> API ROUTE /api/users GESTART <<<');

  try {
    console.log('[API] Voor connectDB()');
    await connectDB();
    console.log('[API] Na connectDB()');

    const User = UserModel as unknown as Model<any>;

    // Haal alle gebruikers op
    const users = await User.find({}).lean();

    console.log('[API] Users opgehaald:', users.length);

    // Veiligheidschecks voor de users array
    const safeUsers = users.map(user => ({
      _id: user._id || 'unknown',
      name: user.name || 'Onbekende gebruiker',
      studentNumber: user.studentNumber || 'N/A',
      favoriteModules: Array.isArray(user.favoriteModules) ? user.favoriteModules : []
    }));

    return safeUsers;

  } catch (error) {
    console.error("[API] Fout bij ophalen van users uit MongoDB:", error);
    setResponseStatus(event, 500);
    return {
      error: 'Kon de user data niet ophalen uit de database.',
      details: (error as Error).message
    };
  }
});
