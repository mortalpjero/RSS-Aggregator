import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import view from './view';

// Список возможных ошибок

const schema = yup.object().shape({
  linkContent: yup.string().url('Ссылка должна быть валидным URL').required(),
});

// Логика поиска ошибок

const validateLink = (fields) => {
  const validation = schema
    .validate(fields, { abortEarly: false })
    .then(() => { })
    .catch((e) => _.keyBy(e.inner, 'path'));
  return validation;
};

// Логика валидации ссылки

const app = () => {
  const state = {
    link: {
      status: 'invalid',
      linkContent: '',
      existingLinks: [],
      error: '',
    },
  };

  // Изменения state

  const handleLinkValidation = (watchedState) => {
    validateLink(watchedState.link).then((validateLinkResult) => {
      const updatedWatchedState = { ...watchedState };

      // Если ошибки есть, то форма становится невалдиной
      // Если в существующий ссылках есть ссылка, то появляется ошибка
      // В остальных случаях форма валидна
      if (!_.isEmpty(validateLinkResult)) {
        updatedWatchedState.link.status = 'invalid';
        updatedWatchedState.link.error = validateLinkResult.linkContent.message;
      } else if (
        updatedWatchedState.link.existingLinks.includes(updatedWatchedState.link.linkContent)
      ) {
        updatedWatchedState.link.status = 'invalid';
        updatedWatchedState.link.error = 'RSS уже существует';
      } else {
        updatedWatchedState.link.status = 'valid';
        updatedWatchedState.link.error = '';
        updatedWatchedState.link.existingLinks.push(updatedWatchedState.link.linkContent);
      }
      view(updatedWatchedState);
    });
  };

  // Логика контроллера

  const watchedState = onChange(state, (path) => {
    if (path === 'link.status' && watchedState.link.status === 'validation') {
      handleLinkValidation(watchedState);
    }
  });

  const linkInput = document.querySelector('#url-input');
  const form = document.querySelector('.rss-form');

  linkInput.addEventListener('input', (e) => {
    watchedState.link.linkContent = e.target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.link.status = 'validation';
    form.reset();
  });
};

export default app;
