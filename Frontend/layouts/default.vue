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
import { useLocale } from '~/composables/UseLocale'; // Importeer useLocale
// ⭐️ NIEUW: Importeer de useUserSelection composable
import { useUserSelection } from '~/composables/UseUserSelection'; 

const { locale, t, toggleLocale } = useLocale(); 
// ⭐️ NIEUW: Haal de setter functie op
const { setSelectedUserId } = useUserSelection();

// --- GEBRUIKER LOGICA ---
type User = { _id: string; name: string; studentNumber: string };
const { data: usersData } = await useFetch<User[]>('/api/users');
const users = computed(() => {
  // Extra veiligheidscheck: zorg ervoor dat we altijd een array hebben
  if (!usersData.value || !Array.isArray(usersData.value)) {
    return [];
  }
  return usersData.value;
});

// 1. Lokale state voor de v-model (de dropdown)
const initialUserId = computed(() => users.value[0]?._id ?? '');
const localSelectedUserId = ref(''); 

// 2. Selecteer de gebruiker op basis van de lokale state
const selectedUser = computed(() => {
  if (!Array.isArray(users.value) || users.value.length === 0) {
    return null;
  }
  return users.value.find(u => u._id === localSelectedUserId.value);
});

// 3. Watcher: Synchroniseer lokale selectie met de globale state
watch(localSelectedUserId, (newVal) => {
  // ⭐️ CRUCIAAL: Update de globale status via de composable
  setSelectedUserId(newVal); 

  if (Array.isArray(users.value)) {
    const user = users.value.find(u => u._id === newVal);
    if (user) {
      console.log(`Geselecteerde gebruiker: ${user.name} (${user.studentNumber})`);
    }
  }
}, { immediate: true }); // Zorg ervoor dat de globale status direct na laden is ingesteld

// 4. Watch voor wanneer users data geladen is
watch(users, (newUsers) => {
  if (
    Array.isArray(newUsers) &&
    newUsers.length > 0 &&
    (!localSelectedUserId.value || !newUsers.some(u => u._id === localSelectedUserId.value))
  ) {
    localSelectedUserId.value = newUsers[0]?._id ?? '';
  }
}, { immediate: true });

// ⭐️ Fix in Template: 
// De v-model is gewijzigd van 'selectedUserId' naar 'localSelectedUserId'
</script>

<style>
/* Modern CSS Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #1f2937;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.main-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.main-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  pointer-events: none;
}

.main-nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.logo {
  font-size: 1.75rem;
  font-weight: 800;
  text-decoration: none;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  gap: 2rem;
  margin-right: auto;
  padding-left: 2rem;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item:hover, .router-link-exact-active {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.language-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-right: 1rem;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.language-button:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.user-dropdown select {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.9);
  color: #1f2937;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.user-dropdown select:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.page-content {
  flex-grow: 1;
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin-top: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.main-footer {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: #d1d5db;
  text-align: center;
  padding: 2rem 0;
  font-size: 0.9rem;
  margin-top: auto;
  position: relative;
}

.main-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-nav {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .nav-links {
    margin-right: 0;
    padding-left: 0;
    gap: 1rem;
  }
  
  .user-dropdown {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .page-content {
    padding: 2rem 1rem;
    margin: 1rem;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}
</style>