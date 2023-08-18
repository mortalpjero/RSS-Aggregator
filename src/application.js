import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import view from './view';
import genLocales from './locales/locale';
import constants from './utils/constants';

// Валидация и генерирования ошибок
// в зависимости от текста в i18next

const validation = (item, i18n) => {
  const locales = genLocales(i18n);
  yup.setLocale(locales);

  const schema = yup.object().shape({
    linkContent: yup.string().url().required(),
  });

  // Логика поиска ошибок

  const validateLink = (fields) => {
    const validationSchema = schema
      .validate(fields, { abortEarly: false })
      .then(() => { })
      .catch((e) => _.keyBy(e.inner, 'path'));
    return validationSchema;
  };

  return validateLink(item);
};

// Логика валидации и обновления watchedState

const validateAndUpdateWatchedState = (watchedState, validateLinkResult, i18n) => {
  const updatedWatchedState = { ...watchedState };

  if (!_.isEmpty(validateLinkResult)) {
    updatedWatchedState.link.status = constants.status.invalid;
    updatedWatchedState.link.error = validateLinkResult.linkContent.message;
  } else if (
    updatedWatchedState.link.existingLinks.includes(updatedWatchedState.link.linkContent)
  ) {
    updatedWatchedState.link.status = constants.status.invalid;
    updatedWatchedState.link.error = i18n.t('errors.existingRSS');
  } else {
    updatedWatchedState.link.status = constants.status.valid;
    updatedWatchedState.link.error = '';
    updatedWatchedState.link.existingLinks.push(updatedWatchedState.link.linkContent);
  }

  return updatedWatchedState;
};

// Логика валидации ссылки

const app = (i18n) => {
  const state = {
    link: {
      status: constants.status.invalid,
      linkContent: '',
      existingLinks: [],
      error: '',
    },
  };

  // Изменения state

  const handleLinkValidation = (watchedState, i18nInstance) => {
    validation(watchedState.link, i18nInstance)
      .then((valResult) => validateAndUpdateWatchedState(watchedState, valResult, i18nInstance))
      .then(() => view(watchedState));
  };

  // Логика контроллера

  const watchedState = onChange(state, (path) => {
    if (path === 'link.status' && watchedState.link.status === constants.status.validation) {
      handleLinkValidation(watchedState, i18n);
    }
  });

  const linkInput = document.querySelector('#url-input');
  const form = document.querySelector('.rss-form');

  linkInput.addEventListener('input', (e) => {
    watchedState.link.linkContent = e.target.value.trim();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.link.status = constants.status.validation;
    form.reset();
  });
};

export default app;
