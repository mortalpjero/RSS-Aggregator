// Значения по умолчанию для ошибок, используя
// библиотеку i18next
const genLocales = (i18n) => ({
  string: {
    url: i18n.t('errors.invalidURL'),
  },
});

export default genLocales;
