import * as yup from 'yup';
import _ from 'lodash';
import genLocales from './locales/locale';

// Валидация ссылки

const validation = (item, i18n) => {
  const locales = genLocales(i18n);
  yup.setLocale(locales);

  const schema = yup.object().shape({
    linkContent: yup.string().url().required(),
  });

  const validateLink = (fields) => {
    const validationSchema = schema
      .validate(fields, { abortEarly: false })
      .then(() => { })
      .catch((e) => _.keyBy(e.inner, 'path'));
    return validationSchema;
  };

  return validateLink(item);
};

export default validation;
