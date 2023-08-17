import i18next from 'i18next';
import './styles.scss';
import 'bootstrap';
import app from './application';
import resources from './locales/ru';

// Асинхронная инициализация инстанса i18next
// и запуск приложения
i18next.init({
  lng: 'ru',
  debug: false,
  resources,
}).then(() => {
  app(i18next);
}).catch((error) => new Error('Error initializing i18next', error));
