// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  // Stel de source directory in op Frontend
  srcDir: 'Frontend/',

  // CSS-bestanden (relatief aan srcDir)
  css: [
    '@/assets/css/main.css'
  ],

  runtimeConfig: {
    MONGODB_URI: process.env.MONGODB_URI, 
    public: {
      // eventueel publieke runtime variabelen
    }
  },
})
