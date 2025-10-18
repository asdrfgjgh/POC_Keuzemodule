<template>
  <div class="home-container">
    <h1>Welkom op de Hoofdpagina</h1>
    <p>Dit is de startpagina van je Nuxt applicatie.</p>
    
    <NuxtLink to="/vkms" class="vkm-link-button">
      Ga naar VKMS Overzicht &rarr;
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
// Stel de titel van de pagina in
useHead({
  title: "Home - Overzicht",
});
</script>

<style scoped>
@import "~/components/VKM.css";
</style>   