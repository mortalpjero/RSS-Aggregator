import * as yup from 'yup';
import _ from 'lodash';
import onChange from 'on-change';
import view from './view';
import genLocales from './locales/locale';
import constants from './utils/constants';
import requestDOM from './getRequest';

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

// Логика поиска по ID

const findById = (items, id) => items.find((item) => item.id === id);

// Модификация Watched State, добавление постов и фидов

const generateRSSInfo = (DOMTree, watchedState) => {
  const newWatchedState = { ...watchedState };
  const mainTitle = DOMTree.querySelector('title');
  const mainDescription = DOMTree.querySelector('description');
  const allPosts = DOMTree.querySelectorAll('item');
  const postUniqueId = _.uniqueId();
  const feedInstance = {
    id: postUniqueId,
    title: mainTitle.textContent,
    description: mainDescription.textContent,
  };
  const newPosts = [];

  allPosts.forEach((singleItem) => {
    const postTitle = singleItem.querySelector('title');
    const postDescription = singleItem.querySelector('description');
    const postLink = singleItem.querySelector('link');
    const postInstance = {
      title: postTitle.textContent,
      description: postDescription.textContent,
      link: postLink.textContent,
      feedId: postUniqueId,
      id: _.uniqueId(),
      clicked: null,
    };
    newPosts.push(postInstance);
  });

  // Combine new posts and existing posts, putting new posts on top
  newWatchedState.RSSLinks.posts = [...newPosts, ...newWatchedState.RSSLinks.posts];

  newWatchedState.RSSLinks.status = constants.status.render;
  newWatchedState.RSSLinks.feeds.unshift(feedInstance);
};

// Получение RSS данных

const getRSS = (watchedState, i18n) => {
  const newWatchedState = { ...watchedState };
  requestDOM(newWatchedState.link.toBeChecked)
    .then((DOM) => {
      const error = DOM.querySelector('parsererror');
      if (error) {
        newWatchedState.link.status = constants.status.invalid;
        newWatchedState.link.error = i18n.t('errors.invalidRSS');
      } else {
        newWatchedState.link.status = constants.status.valid;
        newWatchedState.link.error = i18n.t('success');
        newWatchedState.link.existingLinks.unshift((newWatchedState.link.toBeChecked));
        generateRSSInfo(DOM, newWatchedState);
      }
    })
    .then(() => view(newWatchedState, i18n));
};

// Получение информации для модального окна

const modalSetting = (watchedState) => {
  const newWatchedState = { ...watchedState };
  const desiredEl = findById(newWatchedState.RSSLinks.posts, newWatchedState.modalWindow.id);
  desiredEl.clicked = constants.status.clicked;
  newWatchedState.modalWindow.status = constants.status.render;
  newWatchedState.modalWindow.title = desiredEl.title;
  newWatchedState.modalWindow.description = desiredEl.description;
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
    updatedWatchedState.link.toBeChecked = updatedWatchedState.link.linkContent;
  }

  return updatedWatchedState;
};

// Логика валидации ссылки

const app = (i18n) => {
  const state = {
    link: {
      status: constants.status.invalid,
      linkContent: '',
      toBeChecked: '',
      existingLinks: [],
      error: '',
    },
    RSSLinks: {
      status: constants.status.empty,
      feeds: [],
      posts: [],
    },
    modalWindow: {
      status: constants.status.empty,
      title: '',
      description: '',
      id: '',
    },
  };

  // Изменения state

  const handleLinkValidation = (watchedState, i18nInstance) => {
    validation(watchedState.link, i18nInstance)
      .then((valResult) => validateAndUpdateWatchedState(watchedState, valResult, i18nInstance))
      .then(() => view(watchedState, i18nInstance));
  };

  // Логика контроллера

  const watchedState = onChange(state, (path) => {
    if (path === 'link.status' && watchedState.link.status === constants.status.validation) {
      handleLinkValidation(watchedState, i18n);
    }
    if (path === 'link.toBeChecked') {
      getRSS(watchedState, i18n);
      watchedState.RSSLinks.status = constants.status.rendered;
    }
    if (path === 'modalWindow.status' && watchedState.modalWindow.status === constants.status.render) {
      modalSetting(watchedState);
      view(watchedState, i18n);
      watchedState.modalWindow.status = constants.status.rendered;
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

  document.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('[data-bs-toggle="modal"], [target="_blank"]');
    if (targetBtn) {
      const btnId = targetBtn.getAttribute('data-id');
      watchedState.modalWindow.id = btnId;
      watchedState.modalWindow.status = constants.status.render;
    }
  });
};

export default app;
