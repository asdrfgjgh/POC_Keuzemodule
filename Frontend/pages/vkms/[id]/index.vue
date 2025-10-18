<template>
  <div class="vkms-detail-container">
    <div v-if="pending" style="text-align: center; padding: 40px;">Laden van module details...</div>
    
    <div v-else-if="error" class="error-box">
      <p>⚠️ **Fout:** Kon module niet laden. Details: {{ error.message }}</p>
    </div>
    
    <div v-else-if="!vkm" class="error-box not-found">
      <h1>404 Module Niet Gevonden</h1>
      <p>De module met ID **{{ route.params.id }}** bestaat niet.</p>
      <NuxtLink to="/vkms">Terug naar overzicht</NuxtLink>
    </div>

    <div v-else class="vkm-detail-card">
      <div class="detail-header" :style="{ backgroundImage: 'url(' + detailImageSrc + ')' }">
        <div class="overlay">
          <h1>{{ vkm.name }}</h1>
        </div>
      </div>
      
      <div class="detail-body">
        <div class="meta-data">
          <span class="credit-tag">{{ vkm.ec || vkm.studycredit }} EC</span> 
          <span class="level-tag">Niveau: {{ vkm.level }}</span>
          <span class="id-tag">Module ID: {{ vkm.id }}</span>
        </div>
        
        <div v-if="vkm.tags && vkm.tags.length" class="tag-list">
          <h3>Tags</h3>
          <span 
            v-for="tag in vkm.tags" 
            :key="tag" 
            class="tag-item"
          >
            #{{ tag }}
          </span>
        </div>
        <h2>Beschrijving</h2>
        <p>{{ vkm.description }}</p>

        <NuxtLink to="/vkms" class="back-link">← Terug naar alle modules</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VkmItemData } from "~/Backend/server/types/vkm";
import { computed } from 'vue';

// IMPORTEER DE PAGINA-SPECIFIEKE STIJLEN HIER
import '~/assets/css/pages/vkms-detail.css'; 

// Gebruik useRoute om toegang te krijgen tot de URL-parameters
const route = useRoute();
// Haal de ID uit de URL (bijv. /vkms/101 -> id = "101")
const moduleId = route.params.id;

// 1. DATA OPHALEN VIA DE SERVER ROUTE
// We gebruiken het dynamische ID in de API-call
// Aanname: VkmItemData bevat nu 'tags: string[]'
// ⚠️ FIX: We passen het type aan om de verwachte tags toe te voegen.
interface VkmDetailData extends VkmItemData {
  tags: string[];
  ec?: number; // Toegevoegd van eerdere context
}

const { 
  data, 
  pending, 
  error 
} = await useFetch<VkmDetailData>(`/api/vkms/${moduleId}`);

// 2. Computed Property voor de module
const vkm = computed(() => data.value ?? null);

// 🌟 Berekent de unieke afbeelding URL voor de detailpagina
const detailImageSrc = computed(() => {
    // Check of de vkm data beschikbaar is
    if (vkm.value) {
        // Gebruik de ID om een unieke, consistente afbeelding van Picsum te krijgen.
        return `https://picsum.photos/id/${vkm.value.id}/1200/400`;
    }
    return ''; // Geen afbeelding als de data nog niet geladen is
});

// 3. Stel de paginatitel in op basis van de module
useHead({
  title: vkm.value ? vkm.value.name : 'Module Details',
});
</script>

<style scoped>
/* Dit is optioneel, je kunt de stijlen toevoegen in je vkms-detail.css */
.tag-list {
    margin-top: 15px;
    margin-bottom: 25px;
    padding-top: 10px;
    border-top: 1px solid #eee;
}

.tag-list h3 {
    font-size: 1em;
    font-weight: 600;
    margin-bottom: 8px;
    color: #4b5563;
}

.tag-item {
    display: inline-block;
    background-color: #e5e7eb;
    color: #4b5563;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8em;
    margin-right: 8px;
    margin-bottom: 8px;
}
</style>