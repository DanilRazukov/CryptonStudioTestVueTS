import Vue from 'vue'
import VueI18n from 'vue-i18n'
import dateTimeFormats from '~/locales/dateTimeFormats'

Vue.use(VueI18n)

// Create VueI18n instance with options
export const i18n = new VueI18n({
  locale: 'ru', // set locale
  // @ts-ignore
  dateTimeFormats
})
