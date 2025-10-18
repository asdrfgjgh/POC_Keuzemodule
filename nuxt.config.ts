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
      // eventueel publieke runtime variabelen
    }
  }
})
