// src/i18n/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ru from './ru.json';

i18n
  .use(initReactI18next) // подключает React к i18next
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    lng: 'en', // язык по умолчанию
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // для использования React в HTML
    },
  });

export default i18n;
