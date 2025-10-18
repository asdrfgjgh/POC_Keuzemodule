// Frontend/nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // 💡 Oplossing 1: Schakel SSR uit, zoals u deed, 
  // maar we configureren de Nitro preset voor SWA later.
  ssr: false, 

  // ❌ VERWIJDERD: srcDir: 'Frontend/', 
  // Dit bestand staat al in de source directory.

  // ❌ VERWIJDERD: serverDir: 'Backend/server/', 
  // Dit path is onjuist. Server code voor Nuxt (indien gebruikt) moet in ./server staan.

  // 💡 Oplossing 2: Configureer Nitro voor Azure Static Web Apps
  // Dit zorgt ervoor dat de output mappen correct worden gegenereerd voor SWA CI/CD.
  nitro: {
    preset: 'azure-swa',
  },

  // Vite aliases. De '@' alias is standaard de root van de Nuxt-app, 
  // wat nu de 'Frontend' map is.
  vite: {
    resolve: {
      alias: {
        // U kunt dit alias behouden als u het wilt gebruiken voor absolute imports:
        '@frontend': '/Frontend' 
      }
    }
  },

  // CSS-bestanden. Het pad moet relatief zijn t.o.v. de 'Frontend' root.
  css: [
    'assets/css/main.css' // Verwijder de voorloop-slash '/'
  ],

  // 💡 Oplossing 3: Houd de runtimeConfig. Dit is correct om omgevingsvariabelen door te geven.
  runtimeConfig: {
    MONGODB_URI: process.env.MONGODB_URI,
    public: {
      // Backend API URL voor frontend
      apiBase: process.env.API_BASE_URL || 'https://apijobbahub.azurewebsites.net/api',
      backendUrl: process.env.BACKEND_URL || 'https://apijobbahub.azurewebsites.net'
    }
  }
})