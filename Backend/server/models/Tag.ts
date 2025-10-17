// src/dao/infrastructure/tag.schema.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Interface voor het document (voor typeveiligheid in TypeScript)
export interface ITag extends Document {
    name: string;
}

// 2. Schema Definitie
const TagSchema: Schema<ITag> = new Schema({
    // De naam van de tag (bijv. 'Psychologie', 'Duurzaamheid')
    name: { 
        type: String, 
        required: true, 
        unique: true, // Zorgt ervoor dat elke tagnaam uniek is
        trim: true 
    },
    // Optioneel: Tijdstempels voor aanmaak- en bewerkingsdatum
}, { timestamps: true });

// 3. Model Definitie
// Mongoose converteert 'Tag' naar de collectie 'tags' in MongoDB
export const TagModel: Model<ITag> = mongoose.model<ITag>('Tag', TagSchema);