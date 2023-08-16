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
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
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
    const validateLinkResult = validateLink(watchedState.link);
    if (!_.isEmpty(validateLinkResult)) {
      watchedState.link.status = 'invalid';
      watchedState.link.error = validateLinkResult.linkContent.message;
    } else if (watchedState.link.existingLinks.includes(watchedState.link.linkContent)) {
      watchedState.link.status = 'invalid';
      watchedState.link.error = 'RSS уже существует';
    } else {
      watchedState.link.status = 'valid';
      watchedState.link.error = '';
      watchedState.link.existingLinks.push(watchedState.link.linkContent);
    }
    view(watchedState);
  };

  // Логика контроллера

  const watchedState = onChange(state, path => {
    if (path === 'link.status' && watchedState.link.status === 'validation') {
      handleLinkValidation(watchedState);
    }
  })

  const linkInput = document.querySelector('#url-input');
  const form = document.querySelector('.rss-form');

  linkInput.addEventListener('input', (e) => {
    watchedState.link.linkContent = e.target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.link.status = 'validation'
    form.reset();
  })
};

export default app;
