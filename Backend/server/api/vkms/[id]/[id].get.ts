// /server/api/vkms/[id].ts

import connectDB from '~/Backend/server/utils/db';
import VkmModel from '~/Backend/server/models/Vkm'; 
import type { Model } from 'mongoose';
import { setResponseStatus } from 'h3';

// ⭐️ AANNAMEN: Importeer de TagModel 
// Pas het pad aan indien nodig
import { TagModel } from '~/Backend/server/models/Tag'; 


// ⭐️ NIEUW TYPE: Bijgewerkte interface om de structuur vast te leggen
interface IVkmData {
    studycredit?: number;
    tags?: any; // Nu kan het array van ID's (voor populate) of objecten zijn
    [key: string]: any; 
}

export default defineEventHandler(async (event) => {
    const moduleId = event.context.params?.id;

    if (!moduleId) {
        setResponseStatus(event, 400); // Bad Request
        return { error: 'Module ID ontbreekt.' };
    }

    try {
        await connectDB();

        const Vkm = VkmModel as unknown as Model<any>; 
        
        // 1. Zoek het document en GEBRUIK .populate('tags')
        const vkmResult = await Vkm.findOne({ id: moduleId })
            .populate({
                path: 'tags', // Veld in Vkm document dat de Tag ID's bevat
                model: TagModel, // Model om op te zoeken
                select: 'name' // Haal alleen de naam op
            })
            .lean(); // Gebruik .lean() voor pure JavaScript objecten
        
        if (!vkmResult) {
            setResponseStatus(event, 404);
            return { error: 'Module niet gevonden.' };
        }
        
        // ⭐️ TYPE FIX: Cast het resultaat naar de gedefinieerde interface
        const vkm = vkmResult as IVkmData; 

        // 2. TRANSFORMATIE: Map 'studycredit' naar 'ec' EN tags van objecten naar namen
        const tagNames = Array.isArray(vkm.tags) 
            ? vkm.tags.map((tag: any) => tag.name) // Haal enkel de 'name' op
            : [];
        
        const transformedVkm = {
            ...vkm,
            // EC/Studycredit mapping
            ec: vkm.studycredit ?? 0, 
            
            // ⭐️ Tags mapping
            tags: tagNames // Dit is nu een array van strings (namen)
        };

        return transformedVkm;

    } catch (error) {
        console.error(`Fout bij ophalen van VKM met ID ${moduleId}:`, error);
        setResponseStatus(event, 500); 
        return { 
            error: 'Kon de gevraagde module niet ophalen uit de database.',
            details: (error as Error).message
        };
    }
});