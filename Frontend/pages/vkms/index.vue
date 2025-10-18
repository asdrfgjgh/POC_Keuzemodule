<template>
  <div class="vkms-container">
    <h1>{{ t('page_title') }}</h1>
    
    <div class="search-bar">
      <input
        v-model="searchTerm"
        type="text"
        :placeholder="t('search_placeholder')"
        class="search-input"
      />
    </div>

    <div class="filter-bar">
      <select v-model="selectedLevel" class="filter-select">
        <option value="">{{ t('all_levels') }}</option>
        <option 
          v-for="level in uniqueLevels" 
          :key="level" 
          :value="level"
        >
          {{ level }}
        </option>
      </select>

      <select v-model="selectedCredits" class="filter-select">
        <option value="">{{ t('all_credits') }}</option>
        <option 
          v-for="credit in uniqueCredits" 
          :key="credit" 
          :value="credit"
        >
          {{ credit }} {{ t('credits_unit') }}
        </option>
      </select>
      
      <select v-model="selectedTag" class="filter-select">
        <option value="">{{ t('all_tags') }}</option>
        <option 
          v-for="tag in uniqueTags" 
          :key="tag" 
          :value="tag"
        >
          {{ tag }}
        </option>
      </select>
    </div>

    <div v-if="pending" style="text-align: center; padding: 40px;">{{ t('loading_data') }}</div>
    
    <div v-else-if="error" class="error-message">
      <p>⚠️ <strong>{{ t('error_title') }}:</strong> {{ t('error_details') }}</p>
      <p>Details: {{ error.message }}</p>
    </div>
    
    <div v-else class="vkm-grid">
      <VkmItem
        v-for="item in filteredVkms"
        :key="item._id || item.id"
        :id="item.id"
        :name="item.name"
        :shortdescription="item.shortdescription"
        :description="item.description"
        :image-src="item.imageSrc"
        :studycredit="item.studycredit"
        :level="item.level"
        
        :tags="(item as any).tags" 
        
        @more-info="handleMoreInfo"
        @toggle-favorite="toggleFavoriteModule(String(item.id))"
        :is-favorite="item.isFavorite" 
      />
    </div>

    <div v-if="!pending && !error && filteredVkms.length === 0" style="text-align: center; padding: 40px; color: #4b5563;">
      {{ t('no_results') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'; 
// AANGENOMEN: tags: string[] is toegevoegd aan VkmItemData
import type { VkmItemData } from "~/../Backend/server/types/vkm";
import { useLocale } from '~/composables/UseLocale';
import { useUserSelection } from '~/composables/UseUserSelection';

import '~/assets/css/pages/vkms-list.css'; 

// --- TYPESCRIPT AANPASSING VOOR FAVORITE STATUS ---
interface VkmItemDataWithFavoriteStatus extends VkmItemData {
  isFavorite: boolean;
}
// ---------------------------------------------------

const { locale, t, toggleLocale } = useLocale();

// --- STATE VOOR ZOEKEN EN FILTEREN ---
const searchTerm = ref(''); 
const selectedLevel = ref(''); 
const selectedCredits = ref(''); 
// ⭐️ NIEUW: State voor geselecteerde tag
const selectedTag = ref(''); 

const { selectedUserId } = useUserSelection();

// State om de favoriete module-ID's bij te houden
const favoriteModules = ref<string[]>([]);

// 1. DATA OPHALEN VIA DE SERVER ROUTE met useFetch (de VKM items)
const { 
  data, 
  pending, 
  error 
} = await useFetch<VkmItemData[]>('/api/vkms');

// 2. Computed Property voor Veiligheid (originele data)
const vkms = computed(() => {
  // Extra veiligheidscheck: zorg ervoor dat we altijd een array hebben
  if (!data.value || !Array.isArray(data.value)) {
    return [];
  }
  return data.value;
});

// --- FUNCTIE: FAVORIETEN OPHALEN ---
const fetchFavorites = async () => {
  const currentUserId = selectedUserId.value;

  if (!currentUserId) {
    favoriteModules.value = [];
    return;
  }
  
  try {
    const userData = await $fetch<{ favoriteModules: string[] }>(`/api/users/${currentUserId}`);
    favoriteModules.value = userData.favoriteModules.map(String) ?? [];
    console.log(`Favorieten voor gebruiker ${currentUserId} geladen: ${favoriteModules.value.length} modules.`);
  } catch (e) {
    console.error('Fout bij het ophalen van favorieten:', e);
    favoriteModules.value = [];
  }
};

// 3. Life cycle hook om favorieten op te halen na initiële data-fetch
await fetchFavorites();


// --- DYNAMISCHE FILTERS OPHALEN UIT DE DATA ---
const uniqueLevels = computed(() => {
  if (!Array.isArray(vkms.value)) return [];
  const levels = new Set(vkms.value.map(item => item.level).filter(Boolean));
  return Array.from(levels).sort(); 
});

const uniqueCredits = computed(() => {
  if (!Array.isArray(vkms.value)) return [];
  const credits = new Set(vkms.value.map(item => item.studycredit).filter(Boolean));
  
  return Array.from(credits).sort((a, b) => 
    parseInt(a as string) - parseInt(b as string)
  );
});

// ⭐️ NIEUW: Computed Property voor unieke tags
const uniqueTags = computed(() => {
  if (!Array.isArray(vkms.value)) return [];
  const tags = new Set<string>();
  vkms.value.forEach(item => {
    // Aangenomen dat item.tags een array van strings is.
    if (Array.isArray((item as any).tags)) { 
      (item as any).tags.forEach((tag: string) => {
        if (tag) tags.add(tag);
      });
    }
  });
  return Array.from(tags).sort(); 
});


// 4. COMPUTED PROPERTY: Filter de VKM's EN voeg de 'isFavorite' status toe
const filteredVkms = computed((): VkmItemDataWithFavoriteStatus[] => {
  if (!Array.isArray(vkms.value)) return [];
  let currentVkms = vkms.value;
  
  // Eerst filters toepassen
  if (searchTerm.value) {
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
    currentVkms = currentVkms.filter(item => {
      const titleMatch = item.name.toLowerCase().includes(lowerCaseSearchTerm);
      const descriptionMatch = item.shortdescription.toLowerCase().includes(lowerCaseSearchTerm);
      // Optioneel: Zoeken in tags
      const tagsMatch = (Array.isArray((item as any).tags) && (item as any).tags.some((tag: string) => tag.toLowerCase().includes(lowerCaseSearchTerm)));
      return titleMatch || descriptionMatch || tagsMatch;
    });
  }

  if (selectedLevel.value) {
    currentVkms = currentVkms.filter(item => 
      item.level === selectedLevel.value
    );
  }

  if (selectedCredits.value) {
    currentVkms = currentVkms.filter(item => 
      item.studycredit === selectedCredits.value
    );
  }
  
  // ⭐️ NIEUW: Filteren op geselecteerde tag
  if (selectedTag.value) {
    currentVkms = currentVkms.filter(item => {
      // Controleer of de module een array van tags heeft en de geselecteerde tag bevat
      return Array.isArray((item as any).tags) && (item as any).tags.includes(selectedTag.value);
    });
  }
  // ⭐️ EINDE NIEUW

  // CRUCIAAL: Voeg de isFavorite status toe aan elk item
  return currentVkms.map(item => {
    const isFavorite = favoriteModules.value.includes(String(item.id));
    
    return {
      ...item,
      isFavorite: isFavorite
    } as VkmItemDataWithFavoriteStatus;
  });
});

// Type Guard om 'error is of type unknown' op te lossen
function isFetchError(e: unknown): e is { data?: { message?: string } } {
  return typeof e === 'object' && e !== null && 'data' in e;
}

// 5. FUNCTIE OM DE FAVORIET TE TOGGLEN (TOEVOEGEN OF VERWIJDEREN)
const toggleFavoriteModule = async (moduleId: string) => {
  const currentUserId = selectedUserId.value; 

  if (!currentUserId) {
    alert(t('error_no_user_selected'));
    return;
  }
  
  console.log(`Poging om favorietstatus van module ${moduleId} te togglen voor gebruiker ${currentUserId}...`);

  try {
    const response = await $fetch<{ 
      message: string; 
      isNowFavorite: boolean; 
      user: { name: string; favoriteModules: any[] } 
    }>(`/api/users/${currentUserId}/favorite`, {
      method: 'PATCH', 
      body: {
        moduleId: moduleId 
      }
    });

    const favoriteCount = response.user?.favoriteModules?.length ?? 0;
    const userName = response.user?.name ?? 'Onbekende Gebruiker';
    const isFavoriteNow = response.isNowFavorite; 

    let statusMessage = isFavoriteNow 
      ? `✅ Favoriet toegevoegd`
      : `🗑️ Favoriet verwijderd`;

    alert(`${statusMessage}\n\nGebruiker ${userName} heeft nu ${favoriteCount} favorieten.`);

    // CRUCIALE OPLOSSING: Directe update van de lokale favorietenlijst
    if (isFavoriteNow) {
      if (!favoriteModules.value.includes(moduleId)) {
        favoriteModules.value.push(moduleId);
      }
    } else {
      const index = favoriteModules.value.indexOf(moduleId);
      if (index > -1) {
        favoriteModules.value.splice(index, 1);
      }
    }
    
  } catch (error) {
    console.error('Fout bij het togglen van favoriet:', error);
    
    let errorMessage: string;
    
    if (isFetchError(error) && error.data?.message) {
      errorMessage = error.data.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = t('error_details_generic');
    }
    
    alert(`❌ Fout bij favoriet togglen: ${errorMessage}`);
  }
};


// Event handler functie
const handleMoreInfo = (itemId: number | string) => {
  const message = t('more_info_message') + itemId; 
  alert(message);
};

// Stel de titel van de pagina in
useHead({
  title: t('page_title'), 
});
</script>

<style scoped>
/* Hier komen de stijlen die je in je oorspronkelijke index.vue had. */
/* Omdat je die niet meestuurde, laat ik deze leeg. */
/* Normaal gesproken zou hier een <style> block staan */
</style>