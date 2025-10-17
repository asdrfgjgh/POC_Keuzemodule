// /server/api/vkms.ts

import connectDB from '~/Backend/server/utils/db';
import type { Model } from 'mongoose';
import VkmModel from '~/Backend/server/models/Vkm';

// ⭐️ AANNAMEN: Importeer de TagModel die je eerder hebt gedefinieerd
// Pas het pad aan indien nodig
import { TagModel } from '~/Backend/server/models/Tag'; 

export default defineEventHandler(async (event) => {
  console.log('>>> API ROUTE /api/vkms GESTART <<<');

  try {
    console.log('[API] Voor connectDB()');
    await connectDB();
    console.log('[API] Na connectDB()');

    const vkm = VkmModel as unknown as Model<any>;

    // 1. Haal alle VKM's op en gebruik .populate('tags') om de ID's te vervangen door de volledige Tag documenten.
    const vkmsWithPopulatedTags = await vkm.find({})
      .populate({
        path: 'tags', // Dit is het veld in het Vkm document dat de ID's bevat
        model: TagModel, // Dit is het Model dat gebruikt moet worden om de ID's op te zoeken
        select: 'name' // ⭐️ OPTIONEEL: Selecteer enkel het 'name' veld van de Tag, om dataverkeer te beperken
      })
      .lean(); // Gebruik .lean() voor snellere, pure JavaScript objecten

    console.log('[API] VKMs opgehaald en tags gepopuleerd:', vkmsWithPopulatedTags.length);

    // 2. TRANSFORMATIE: Verander de gepopuleerde Tag objecten naar een array van enkel de namen.
    const transformedVkms = vkmsWithPopulatedTags.map(item => {
      // Controleer of 'tags' gepopuleerd en een array is
      const tagNames = Array.isArray(item.tags) 
        ? item.tags.map((tag: any) => tag.name) // Haal enkel de 'name' op
        : [];
      
      // Retourneer het VKM-item met het aangepaste tags-veld
      return {
        ...item,
        tags: tagNames // Dit is nu een array van strings (namen) i.p.v. ID's of objecten
      };
    });

    // 3. Stuur de getransformeerde data terug naar de client
    return transformedVkms;

  } catch (error) {
    // Afhandeling van fouten
    console.error("[API] Fout bij ophalen/populeren van VKMs uit MongoDB:", error);
    setResponseStatus(event, 500);
    return {
      error: 'Kon de VKM data niet ophalen uit de database.',
      details: (error as Error).message
    };
  }
});