// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  // Configureer de source directory naar Frontend
  srcDir: 'Frontend/',

  // Configureer server directory naar Backend
  serverDir: 'Backend/server/',

  // Vite aliases zodat Frontend map gevonden wordt
  vite: {
    resolve: {
      alias: {
        '@frontend': '/Frontend'
      }
    }
  },

  // CSS-bestanden via alias
  css: [
    '/assets/css/main.css'
  ],

  runtimeConfig: {
    MONGODB_URI: process.env.MONGODB_URI,
    public: {
      // Backend API URL voor frontend
      apiBase: process.env.API_BASE_URL || 'https://apijobbahub.azurewebsites.net/api',
      backendUrl: process.env.BACKEND_URL || 'https://apijobbahub.azurewebsites.net'
    }
  }
})
