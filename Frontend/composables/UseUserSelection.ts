// composables/useUserSelection.ts

import { set } from 'mongoose';
import { ref, watch } from 'vue';

// De 'selectedUserId' is reeds gedefinieerd en geëxporteerd (van de UserDropdown)
export const selectedUserId = ref<string | null>(null);

// NIEUW: State om de favoriete Module ID's bij te houden
export const favoriteModuleIds = ref<string[]>([]);
export const isFetchingFavorites = ref(false);

/**
 * Functie om de favorieten van de geselecteerde gebruiker op te halen
 * (Dit roept een nieuwe, eenvoudige API-route aan, bijv. /api/users/{id})
 */
const fetchFavorites = async (userId: string) => {
    isFetchingFavorites.value = true;
    favoriteModuleIds.value = []; // Reset de lijst
    
    if (!userId) {
        isFetchingFavorites.value = false;
        return;
    }

    try {
        // VRAAG: U heeft een eenvoudige GET-route nodig die alle gebruikersdata (inclusief favorieten) retourneert
        // We gaan ervan uit dat /api/users/{id} dit doet.
        const user = await $fetch<{ favoriteModules: string[] }>(`/api/users/${userId}`); 
        
        favoriteModuleIds.value = user.favoriteModules || [];
        console.log(`Geladen ${favoriteModuleIds.value.length} favorieten voor gebruiker ${userId}`);
        
    } catch (error) {
        console.error('Fout bij het laden van favorieten:', error);
        favoriteModuleIds.value = [];
    } finally {
        isFetchingFavorites.value = false;
    }
};

// NIEUW: Watcher om de favorieten te laden wanneer de gebruiker verandert
watch(selectedUserId, (newId) => {
    if (newId) {
        fetchFavorites(newId);
    } else {
        favoriteModuleIds.value = [];
    }
}, { immediate: true });


// Exporteer de hoofdfunctie
export const useUserSelection = () => {
    // NIEUW: Functie om de favorietenlijst lokaal te updaten na een POST-actie
    const updateFavorites = (moduleId: string, isFavorite: boolean) => {
        if (isFavorite && !favoriteModuleIds.value.includes(moduleId)) {
            favoriteModuleIds.value.push(moduleId);
        } else if (!isFavorite) {
            favoriteModuleIds.value = favoriteModuleIds.value.filter(id => id !== moduleId);
        }
    };
    
    return {
        selectedUserId,
        favoriteModuleIds, // Exporteer de lijst
        isFetchingFavorites,
        updateFavorites, // Exporteer de update functie
        setSelectedUserId: (id: string | null) => { selectedUserId.value = id; }
    };
};