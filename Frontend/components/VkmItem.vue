<template>
  <div class="hero-container">
    <div class="hero-image">
      <img :src="imageSrc" :alt="`Afbeelding voor ${name}`" />
    </div>

    <button
      class="favorite-button"
      :class="{ 'is-favorite': isFavorite }"
      @click="handleFavorite"
    >
      {{ isFavorite ? '★ Gefavoriet' : '☆ Favoriet' }}
    </button>
    
    <div class="hero-content">
      <div class="tags">
        <span class="tag p3">{{ level }}</span>
        <span class="tag ects">{{ studycredit }}</span>
        
        <span 
          v-for="tag in tags" 
          :key="tag" 
          class="tag dynamic-tag"
        >
          {{ tag }}
        </span>
        </div>

      <div class="course-info">
        <p class="course-code">VKA{{ id }}</p>
        <h2 class="course-title">{{ name }}</h2>
        <p class="course-description">{{ shortdescription }}</p>
      </div>

      <div class="action-buttons">
        <button class="info-button" @click="handleClick">Meer info</button>
        <button class="enroll-button">Aanmelden via Osiris</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VkmItemData } from "~/Backend/server/types/vkm";
import { computed } from "vue"; 

const emit = defineEmits(["moreInfo", "toggleFavorite"]);

const router = useRouter();

// AANGEPAST: De 'tags' eigenschap toegevoegd aan de lokale interface voor props
interface VkmItemDataWithFavorite extends Omit<VkmItemData, 'imageSrc'> {
  isFavorite: boolean;
  tags?: string[]; // 👈 Tags toegevoegd
}

const props = withDefaults(defineProps<VkmItemDataWithFavorite>(), {
  id: 0,
  name: "Standaard VKM",
  shortdescription: "Dit is een beschrijving van het VKM-item.",
  studycredit: "0 EC", 
  level: "N/A",
  tags: () => [], // Default waarde voor tags (een lege array)
  isFavorite: false, 
});

// Berekent de unieke afbeelding URL op basis van de VKM-ID
const imageSrc = computed(() => {
  // Gebruikt de ID om een unieke, consistente afbeelding van Picsum te krijgen.
  return `https://picsum.photos/id/${props.id}/400/250`;
});

// Functie voor de 'Meer info' knop (emittert event en navigeert)
const handleClick = () => {
  emit("moreInfo", props.id);
  router.push(`/vkms/${props.id}`);
};

// Functie om de favorietstatus te togglen
const handleFavorite = () => {
  emit("toggleFavorite", String(props.id));
};
</script>

<style scoped>
/* Zorg ervoor dat je VKM.css importeert of de inhoud ervan hier plakt */
@import "./VKM.css";

/* --- START: Component specifieke stijlen --- */

.hero-container {
  position: relative;
  display: flex; /* Zodat de image en content naast elkaar kunnen */
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.hero-image img {
  width: 100%;
  height: 250px; 
  object-fit: cover; 
  display: block;
}

.hero-content {
  padding: 16px;
  flex-grow: 1; /* Laat de content de resterende ruimte innemen */
  display: flex;
  flex-direction: column;
}

.favorite-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  
  background-color: white; 
  color: #e53e3e; 
  border: 2px solid #e53e3e; 
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s, color 0.2s;
}

.favorite-button:hover {
  background-color: #fcebeb;
}

.favorite-button.is-favorite {
  background-color: #e53e3e;
  color: white;
  border: 2px solid #e53e3e;
}

.favorite-button.is-favorite:hover {
  background-color: #c53030;
}

/* Stijlen voor de tags */
.tags {
  display: flex;
  flex-wrap: wrap; 
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

/* Stijl voor level tag (voorbeeld: P3) */
.tag.p3 {
  background-color: #bee3f8; /* Licht blauw */
  color: #2b6cb0; /* Donker blauw */
}

/* Stijl voor credit tag (ECTS) */
.tag.ects {
  background-color: #c6f6d5; /* Licht groen */
  color: #276749; /* Donker groen */
}

/* 💡 NIEUW: Stijl voor de dynamische tags */
.tag.dynamic-tag {
  background-color: #f7fafc; 
  color: #4a5568; 
  border: 1px solid #e2e8f0; 
}

/* Course info */
.course-code {
  font-size: 0.9em;
  color: #718096;
  margin-bottom: 4px;
}

.course-title {
  font-size: 1.5em;
  margin: 0 0 8px 0;
  color: #2d3748;
}

.course-description {
  color: #4a5568;
  flex-grow: 1;
  margin-bottom: 16px;
}

/* Action buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto; /* Zorgt ervoor dat de knoppen onderaan staan */
}

.info-button,
.enroll-button {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.info-button {
  background-color: #e2e8f0; 
  color: #2d3748;
  border: 1px solid #cbd5e0;
}

.enroll-button {
  background-color: #4299e1; /* Blauw */
  color: white;
  border: none;
}

.enroll-button:hover {
  background-color: #3182ce;
}

.info-button:hover {
  background-color: #cbd5e0;
}

/* --- END: Component specifieke stijlen --- */
</style>