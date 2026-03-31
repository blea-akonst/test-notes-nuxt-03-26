export default defineNuxtConfig({
  compatibilityDate: '2024-10-22',

  ssr: false,

  devtools: { enabled: false },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
  ],

  i18n: {
    locales: [
      { code: 'ru', file: 'ru.json', name: 'Русский' },
      { code: 'en', file: 'en.json', name: 'English' },
    ],
    defaultLocale: 'ru',
    lazy: true,
    langDir: 'locales',
    strategy: 'no_prefix',
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  css: [
    '@fontsource/inter/400.css',
    '@fontsource/inter/500.css',
    '@fontsource/inter/600.css',
    '@fontsource/inter/700.css',
    '~/assets/css/style.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/css/variables/variables-scss";',
          silenceDeprecations: ['legacy-js-api', 'import'],
        },
      },
    },
  },

  app: {
    head: {
      title: 'Notes App',
      htmlAttrs: {
        lang: 'ru',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'SPA приложение для заметок' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  typescript: {
    strict: true,
  },
})
