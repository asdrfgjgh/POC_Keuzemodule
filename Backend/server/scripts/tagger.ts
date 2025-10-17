import mongoose from 'mongoose';
import type { IVkm } from '../../server/models/Vkm.ts';

import { VkmModel } from '../../../Backend/server/models/Vkm';

import { TagModel } from '../../../Backend/server/models/Tag';
import dotenv from 'dotenv';

dotenv.config();

// ---------- CONFIGURATIE ----------

const MONGODB_URI = process.env.MONGODB_URI;

// Breid deze map uit met de keywords waarop je wilt zoeken en de tag die je wilt toekennen.
const tagKeywordMap: { [key: string]: string[] } = {
  'Psychologie': ['psychologie', 'gedrag', 'brein', 'cognitieve', 'psychiatrie'],
  'Internationaal': ['international', 'abroad', 'buitenland', 'overseas', 'global'],
  'Communicatie': ['communicatie', 'gespreksvoering', 'interview', 'presenteren', 'media'],
  'Leiderschap': ['leiderschap', 'manager', 'leiden', 'bestuur'],
  'Onderzoek': ['onderzoek', 'analyse', 'data', 'kwalitatief', 'kwantitatief', 'onderzoeken', 'wetenschap'],
  'Ethiek': ['ethiek', 'ethische', 'integriteit', 'normen', 'waarden', 'moreel'],
  'Techniek': ['techniek', 'technische', 'engineering', 'technologisch', 'ict', 'it', 'bim', 'infrastructuur', 'civiele'],
  'Gezondheidszorg': ['zorg', 'verpleegkunde', 'medisch', 'gezondheid', 'health', 'ggz', 'ziekenhuis', 'musculoskeletaal'],
  'Persoonlijke Ontwikkeling': ['persoonlijke ontwikkeling', 'zelfbewustzijn', 'authenticiteit', 'professionals', 'vaardigheden', 'oriëntatie', 'beroepenveld', 'patronen doorbreken'],
  'Ondernemerschap': ['ondernemerschap', 'business', 'ondernemend', 'innovatie', 'merknamenagement', 'startup', 'onderneming', 'bedrijf'],
  'Duurzaamheid': ['duurzaam', 'sustainable', 'biobased', 'circulair', 'samenleven', 'milieu', 'energie'],
  'Digitaal': ['digital', 'data', 'cybersecurity', 'technologie', 'online', 'nomads', 'it'],
  'Creativiteit': ['kunst', 'design', 'artistiek', 'creativiteit', 'cultureel', 'muziek', 'performance'],
  'Recht & Maatschappij': ['recht', 'maatschappij', 'juridisch', 'gedwongen kader'],
  'Management': ['management', 'strategisch', 'projectmanagement', 'organisatie', 'bedrijfskunde', 'lean', 'belt', 'procesverbetering'],
  'Jeugd & Onderwijs': ['jeugd', 'onderwijs', 'pedagogisch', 'didactische'],
  'Sport & Beweging': ['sport', 'beweging', 'bewegingsonderwijs', 'wervelkolom'],
  'Sociaal & Welzijn': ['sociale', 'welzijn', 'samenleving', 'verbinding', 'maatschappelijk'],
  'Veiligheid': ['safety', 'veiligheid'],
  'AI & Data Science': ['computer vision', 'artificial intelligence', 'ai', 'machine learning', 'data science']
};
// ----------------------------------

async function runSeed() {
  if (!MONGODB_URI) {
    console.error('MONGO_URI is niet ingesteld.');
    return;
  }
  await mongoose.connect(MONGODB_URI);
  console.log('Verbonden met de database.');

  try {
    const allModules: IVkm[] = await VkmModel.find({});
    if (allModules.length === 0) {
      console.log('Geen modules gevonden om te taggen.');
      return;
    }

    console.log(`\n${allModules.length} modules gevonden. Start met taggen...`);
    let updatedCount = 0;
    let skippedCount = 0;
    const untaggedModules: string[] = [];

    for (const module of allModules) {
      // Controleer welke velden ontbreken en log dit expliciet (AANPASSING)
      if (!module.name || !module.description || !module.shortdescription || !module.learningoutcomes) {
        const missingFields = [];
        if (!module.name) missingFields.push('name');
        if (!module.description) missingFields.push('description');
        if (!module.shortdescription) missingFields.push('shortdescription');
        if (!module.learningoutcomes) missingFields.push('learningoutcomes');

        console.warn(`WAARSCHUWING: Module '${module.name || module._id}' overgeslagen. Ontbrekende velden: ${missingFields.join(', ')}.`);
        skippedCount++;
        continue;
      }

      const tagsToApply: mongoose.Types.ObjectId[] = [];
      // Combineer de bestaande velden tot de zoektekst
      const searchText = `${module.name} ${module.shortdescription} ${module.description}`.toLowerCase();

      for (const tagName in tagKeywordMap) {
        const keywords = tagKeywordMap[tagName];
        if (keywords.some((keyword: string) => searchText.includes(keyword))) {
          const tag = await TagModel.findOneAndUpdate(
            { name: tagName },
            { $setOnInsert: { name: tagName } },
            { upsert: true, new: true }
          );

          if (tag) {
            tagsToApply.push(tag._id as mongoose.Types.ObjectId);
          }
        }
      }
      
      if (tagsToApply.length > 0) {
        const currentTagIds = (module.tags || []).map(t => t.toString()).sort();
        const newTagIds = tagsToApply.map(t => t.toString()).sort();
        
        const areTagsSame = JSON.stringify(currentTagIds) === JSON.stringify(newTagIds);

        if (!areTagsSame) {
          module.tags = tagsToApply;
          await module.save();
          updatedCount++;
          console.log(`Module '${module.name}' bijgewerkt met ${tagsToApply.length} tag(s).`);
        }
      } else {
        // Voeg de naam van de module toe aan de lijst van niet-getagde modules
        untaggedModules.push(module.name);
      }
    }

    console.log(`\nKlaar! ${updatedCount} van de ${allModules.length} modules zijn bijgewerkt of hadden al de juiste tags. 🎉`);
    if (skippedCount > 0) {
      console.log(`${skippedCount} module(s) zijn overgeslagen vanwege ontbrekende data.`);
    }

    // ---- TOON DE MODULES ZONDER TAGS ----
    if (untaggedModules.length > 0) {
      console.log('\n-----------------------------------------------------');
      console.log(`De volgende ${untaggedModules.length} module(s) hebben geen tag gekregen:`);
      untaggedModules.forEach(name => console.log(`- ${name}`));
      console.log('Overweeg om nieuwe tags of trefwoorden toe te voegen aan de tagKeywordMap om deze te dekken.');
      console.log('-----------------------------------------------------');
    } else if (skippedCount === 0) { // Toon ALLEEN de succesmelding als er GEEN modules zijn overgeslagen (AANPASSING)
      console.log('\nAlle modules zijn succesvol van een of meerdere tags voorzien!');
    } else {
        console.log('\nEr zijn geen modules zonder tags overgebleven, maar let op de overgeslagen modules hierboven. ☝️');
    }


  } catch (error) {
    console.error('Er is een fout opgetreden tijdens het seeden:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Databaseverbinding gesloten.');
  }
}

runSeed();