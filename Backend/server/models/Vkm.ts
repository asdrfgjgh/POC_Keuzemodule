// src/models/Vkm.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Aangepaste Interface (IVkm)
export interface IVkm extends Document { 
    id: number; 
    name: string; // ⭐ AANPASSING: title is nu name
    description: string;
    shortdescription: string;
    credits: string;
    level: string;
    imageSrc: string;
    
    learningoutcomes: string[]; 
    tags?: mongoose.Types.ObjectId[]; 
}

// 2. Aangepast Schema Definitie (VkmSchema)
const VkmSchema: Schema<IVkm> = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    // ⭐ AANPASSING: Het veld is nu name en map direct naar de DB. De alias is verwijderd.
    name: {
        type: String,
        required: false, // Zet op false om modules met lege namen niet over te slaan
    },
    description: {
        type: String,
        required: false, // Gezet op false voor flexibiliteit met ontbrekende data
    },
    shortdescription: {
        type: String,
        required: false, // Gezet op false voor flexibiliteit met ontbrekende data
    },
    // ⭐ FIX 2: Map 'credits' naar het databaseveld 'studycredit' (Deze alias laten we staan)
    credits: {
        type: String,
        default: '0 EC',
        alias: 'studycredit', // Mongoose zal 'studycredit' gebruiken voor dit veld.
    },
    level: {
        type: String,
        default: 'N/A',
    },
    imageSrc: {
        type: String,
        default: 'https://picsum.photos/id/10/300/200',
    },
    
    learningoutcomes: {
        type: [String], // Array van strings
        default: [],
    },

    tags: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tag' 
    }]

}, { 
    timestamps: true,
    // De virtuele properties blijven nodig voor de 'credits' alias.
    toObject: { virtuals: true }, 
    toJSON: { virtuals: true }
});

// 3. Model Definitie (ongewijzigd)
export const VkmModel: Model<IVkm> = 
    (mongoose.models.Vkm as Model<IVkm>) || 
    mongoose.model<IVkm>('Vkm', VkmSchema);

export default VkmModel;