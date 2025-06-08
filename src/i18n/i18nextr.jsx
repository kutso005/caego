import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      services: "Наши услуги",
      catalog: "Каталог",
      engineering: "Инженерия",
      pipes: "Пластовые трубы",
      partners: "Партнёры",
      about: "О нас",
      contact: "Контакты",
    our:"Наши преимущества",
    ourContact:"Наши Контакты"
    }
  },
  ky: {
    translation: {
      services: "Биздин кызматтар",
      catalog: "Каталог",
      engineering: "Инженерия",
      pipes: "Пластикалык түтүктөр",
      partners: "Өнөктөштөр",
      about: "Биз жөнүндө",
      contact: "Байланыш",
      our:"Биздин артыкчылыктар",
      ourContact:"Биздин байланыш",
    }
  },
  en: {
    translation: {
      services: "Our Services",
      catalog: "Catalog",
      engineering: "Engineering",
      pipes: "Plast pipes",
      partners: "Partners",
      about: "About Us",
      contact: "Contact",
      our:"Our Benefits",
      ourContact:"Our Contact"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ru",
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 