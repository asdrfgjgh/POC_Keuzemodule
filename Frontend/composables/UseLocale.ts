// composables/useLocale.ts

import { ref } from 'vue';

// --- VERTALINGSDATA (Gecentraliseerd) ---
// Bevat alle vertalingen voor de lay-out en de VKMs-pagina
const translations = {
  nl: {
    // Lay-out Vertalingen
    portal: 'VKM Portal',
    home: 'Home',
    overview: 'VKMs Overzicht',
    user_label: 'Gebruiker',
    selected_user: 'Geselecteerd',
    footer_text: 'VKM Project. Alle rechten voorbehouden.',

    // VKMs Pagina Vertalingen
    page_title: 'Overzichtspagina VKMS',
    search_placeholder: 'Zoek op titel of beschrijving...',
    all_levels: 'Alle Niveaus',
    all_credits: 'Alle EC\'s',
    credits_unit: 'EC',
    loading_data: 'Laden van VKMs vanuit de database...',
    error_title: 'Fout bij laden van data',
    error_details: 'Kon geen verbinding maken met de API of database.',
    no_results: 'Er zijn momenteel geen VKM modules beschikbaar die voldoen aan de zoekterm en filters.',
    more_info_message: 'Meer info event ontvangen voor item met ID: ', // Gebruikt in handleMoreInfo
    error_no_user_selected: 'Geen gebruiker geselecteerd. Selecteer een gebruiker om door te gaan.',
    error_details_generic: 'Er is een onverwachte fout opgetreden. Probeer het later opnieuw.',
    loading_favorites: 'Laden van favoriete modules...',
    action_add: 'Toevoegen',
    action_remove: 'Verwijderen',
    favorite_added: 'Module toegevoegd aan favorieten',
    favorite_removed: 'Module verwijderd uit favorieten',
    all_tags: 'Alle Tags',
  },
  en: {
    // Lay-out Vertalingen
    portal: 'VKM Portal',
    home: 'Home',
    overview: 'VKMs Overview',
    user_label: 'User',
    selected_user: 'Selected',
    footer_text: 'VKM Project. All rights reserved.',

    // VKMs Pagina Vertalingen
    page_title: 'VKMS Overview Page',
    search_placeholder: 'Search by title or description...',
    all_levels: 'All Levels',
    all_credits: 'All Credits',
    credits_unit: 'Credits',
    loading_data: 'Loading VKMs from the database...',
    error_title: 'Error loading data',
    error_details: 'Could not connect to the API or database.',
    no_results: 'There are currently no VKM modules available that match the search term and filters.',
    more_info_message: 'More info event received for item with ID: ', // Gebruikt in handleMoreInfo
    error_no_user_selected: 'No user selected. Please select a user to proceed.',
    error_details_generic: 'An unexpected error occurred. Please try again later.',
    loading_favorites: 'Loading favorite modules...',
    action_add: 'Add',
    action_remove: 'Remove',
    favorite_added: 'Module added to favorites',
    favorite_removed: 'Module removed from favorites',
    all_tags: 'All Tags',
  },
};

// Bepaal het type voor de vertaalsleutels en de mogelijke talen
type TranslationKey = keyof (typeof translations)['nl'];
type Locale = 'nl' | 'en';

/**
 * Composable om de taalstatus en vertaalfuncties globaal te beheren.
 * Maakt gebruik van Nuxt's useState om de taal over de hele applicatie te delen.
 */
// BELANGRIJK: Gebruik 'export const' om de functie beschikbaar te maken voor import
export const useLocale = () => {
  // Gebruik useState voor globale, deelbare state in Nuxt 3
  // De sleutel ('locale') zorgt ervoor dat de staat geserialiseerd en gedeeld wordt.
  const locale = useState<Locale>('locale', () => 'nl'); 
  
  // Functie om de taal te wisselen tussen 'nl' en 'en'
  const toggleLocale = () => {
    locale.value = locale.value === 'nl' ? 'en' : 'nl';
    console.log(`Taal gewisseld naar: ${locale.value}`);
  };

  /**
   * Vertaalfunctie om tekst op te halen op basis van de key en huidige taal.
   * @param key De sleutel van de vertaling.
   * @returns De vertaalde string.
   */
  const t = (key: TranslationKey) => {
    const currentLocale = locale.value;
    // Gebruik de huidige 'locale' om de juiste dictionary te kiezen
    const dict = translations[currentLocale as Locale] || translations.nl;
    return dict[key] || key; // Valt terug op de sleutel als vertaling ontbreekt
  };

  return {
    locale, // De reactive state van de huidige taal
    t,      // De centrale vertaalfunctie
    toggleLocale, // De functie om de taal te wisselen
  };
};