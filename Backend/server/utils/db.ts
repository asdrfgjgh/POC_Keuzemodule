import mongoose from 'mongoose';

const config = useRuntimeConfig();

let uri = (config as any).MONGODB_URI; 
console.log('[connectDB] Opgehaalde MONGODB_URI:', uri);

let isConnected = false; 

export default async function connectDB() {
  console.log('[connectDB] connectDB() aangeroepen');

  if (!uri) {
    console.error('[connectDB] FATALE FOUT: MongoDB URI is niet gedefinieerd in runtimeConfig. Controleer .env en nuxt.config.ts.');
    return;
  }
  
  if (isConnected) {
    console.log('[connectDB] => Gebruikt bestaande database verbinding');
    return;
  }

  try {
    console.log('[connectDB] Probeer verbinding te maken met MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, 
    } as mongoose.ConnectOptions); 
    
    isConnected = true;
    console.log('[connectDB] => Nieuwe database verbinding gemaakt!');
    
  } catch (error) {
    console.error('[connectDB] Fout bij het verbinden met MongoDB:', error);
    if (process) {
        process.exit(1); 
    }
  }
}