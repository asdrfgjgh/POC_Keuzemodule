// Bestand: ~/server/types/vkm.ts

/**
 * Definiëert de gedeelde structuur van een VKM item.
 * Aangepast om overeen te komen met MongoDB veldnamen.
 */
export interface VkmItemData {
  _id?: string; 

  // Fields that map directly to the MongoDB document:
  id: number | string;
  shortdescription: string;
  description: string;
  level: string;
  
  // Fields that need renaming (Type Alias for frontend compatibility):
  name: string; // De 'title' van de frontend is 'name' in de DB
  studycredit: number | string; // De 'credits' van de frontend is 'studycredit' in de DB
  
  // Optionele velden (of velden die je mockt/hardcodeert)
  imageSrc?: string; // Optioneel, omdat het niet in de DB zit.

  // Optionele velden uit het document, als je die nodig hebt:
  // shortdescription?: string;
  // content?: string;
  // location?: string;
  // contact_id?: number;
  // learningoutcomes?: string;
}