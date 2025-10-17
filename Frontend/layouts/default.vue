<template>
  <div class="app-layout">
    <header class="main-header">
      <nav class="main-nav">
        <NuxtLink to="/" class="logo">{{ t('portal') }}</NuxtLink>
        
        <div class="nav-links">
          <NuxtLink to="/" class="nav-item">{{ t('home') }}</NuxtLink>
          <NuxtLink to="/vkms" class="nav-item">{{ t('overview') }}</NuxtLink>
        </div>
        
        <button @click="toggleLocale" class="language-button">
          {{ locale === 'nl' ? 'Switch to EN' : 'Schakel naar NL' }}
        </button>

        <div class="user-dropdown">
          <label for="user-select" style="color:white; margin-right: 6px;">{{ t('user_label') }}:</label>
          <select id="user-select" v-model="localSelectedUserId">
            <!-- Let op: De <small> tag was verkeerd geplaatst in de <select>, ik heb deze weggehaald -->
            <option v-for="user in users" :key="user._id" :value="user._id">
              {{ user.name }} ({{ user.studentNumber }})
            </option>
          </select>
           <!-- Display geselecteerde gebruiker buiten de select -->
           <div v-if="selectedUser" style="margin-left: 10px;">
             <small style="color:white;">
               {{ t('selected_user') }}: {{ selectedUser.name }} ({{ selectedUser.studentNumber }})
             </small>
           </div>
        </div>
      </nav>
    </header>

    <main class="page-content">
      <slot />
    </main>

    <footer class="main-footer">
      © {{ new Date().getFullYear() }} {{ t('footer_text') }}
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useLocale } from '~/Frontend/composables/UseLocale'; // Importeer useLocale
// ⭐️ NIEUW: Importeer de useUserSelection composable
import { useUserSelection } from '~/Frontend/composables/UseUserSelection'; 

const { locale, t, toggleLocale } = useLocale(); 
// ⭐️ NIEUW: Haal de setter functie op
const { setSelectedUserId } = useUserSelection();

// --- GEBRUIKER LOGICA ---
type User = { _id: string; name: string; studentNumber: string };
const { data: usersData } = await useFetch<User[]>('/api/users');
const users = computed(() => usersData.value ?? []);

// 1. Lokale state voor de v-model (de dropdown)
const initialUserId = users.value[0]?._id ?? '';
const localSelectedUserId = ref(initialUserId); 

// 2. Selecteer de gebruiker op basis van de lokale state
const selectedUser = computed(() =>
  users.value.find(u => u._id === localSelectedUserId.value)
);

// 3. Watcher: Synchroniseer lokale selectie met de globale state
watch(localSelectedUserId, (newVal) => {
  // ⭐️ CRUCIAAL: Update de globale status via de composable
  setSelectedUserId(newVal); 

  const user = users.value.find(u => u._id === newVal);
  if (user) {
    console.log(`Geselecteerde gebruiker: ${user.name} (${user.studentNumber})`);
  }
}, { immediate: true }); // Zorg ervoor dat de globale status direct na laden is ingesteld

// ⭐️ Fix in Template: 
// De v-model is gewijzigd van 'selectedUserId' naar 'localSelectedUserId'
</script>

<style>
/* ... (De <style> sectie blijft EXACT hetzelfde) ... */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  background-color: #f4f4f9;
  color: #333;
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-header {
  background-color: #10b981;
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-nav {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
  text-decoration: none;
  color: white;
}

.nav-links {
  display: flex;
  gap: 20px;
  margin-right: auto;
  padding-left: 20px;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-item:hover, .router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.language-button {
  background-color: #2ecc71;
  color: white;
  border: 1px solid white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s, transform 0.1s;
  margin-right: 15px;
  white-space: nowrap;
}

.language-button:hover {
  background-color: #1abc9c;
  transform: translateY(-1px);
}

.user-dropdown {
  display: flex;
  align-items: center;
}

.user-dropdown select {
  padding: 6px;
  border-radius: 4px;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  font-weight: 500;
}

.page-content {
  flex-grow: 1;
  padding: 30px 20px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.main-footer {
  background-color: #333;
  color: #ccc;
  text-align: center;
  padding: 15px 0;
  font-size: 0.8em;
  margin-top: auto;
}
</style>