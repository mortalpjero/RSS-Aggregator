import onChange from 'on-change';
import view from './view';
import { status, submit } from './utils/constants';
import validation from './validation';
import usePostStore from './post/store/usePostStore';
import useFeedStore from './feeds/store/useFeedStore';
import useModalStore from './modal/store/useModalStore';
import {
  validateAndUpdateWatchedState,
  getRSS,
} from './rss';

const app = (i18n) => {
  const { postState, updatePosts } = usePostStore();
  const { feedState } = useFeedStore();
  const { modalSetting } = useModalStore();
  // Форма и инпут для фокуса и ресета при отправке

  const linkInput = document.querySelector('#url-input');
  const form = document.querySelector('.rss-form');

  // Стейт приложения

  const state = {
    link: {
      status: status.invalid,
      linkContent: '',
      toBeChecked: '',
      existingLinks: [],
      error: '',
      submit: submit.enabled,
    },
    RSSLinks: {
      status: status.empty,
      feeds: feedState.feeds,
      posts: postState.posts,
    },
    modalWindow: {
      status: status.empty,
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
    if (path === 'link.status') {
      if (watchedState.link.status === status.validation) {
        watchedState.link.submit = submit.disabled;
        handleLinkValidation(watchedState, i18n);
      }
      if (watchedState.link.status === status.valid) {
        form.reset();
        linkInput.focus();
      }
    }
    if (path === 'link.toBeChecked') {
      getRSS(watchedState, i18n);
      watchedState.RSSLinks.status = status.rendered;
    }
    if (path === 'RSSLinks.status') {
      if (watchedState.RSSLinks.status === status.update) {
        view(watchedState, i18n);
        watchedState.RSSLinks.status = status.render;
      }
      if (watchedState.RSSLinks.status === status.rendered) {
        watchedState.link.submit = submit.disabled;
        view(watchedState, i18n);
      }
      if (watchedState.RSSLinks.status === status.render) {
        watchedState.link.submit = submit.enabled;
        view(watchedState, i18n);
      }
    }
    if (path === 'link.submit') {
      if (watchedState.link.submit === submit.enabled) {
        view(watchedState, i18n);
      }
    }
    if (path === 'modalWindow.status' && watchedState.modalWindow.status === status.render) {
      modalSetting(watchedState);
      view(watchedState, i18n);
      watchedState.modalWindow.status = status.rendered;
    }
  });

  updatePosts(watchedState);

  // Все эвенты приложения

  linkInput.addEventListener('input', (e) => {
    watchedState.link.linkContent = e.target.value.trim();
  });

  linkInput.addEventListener('click', () => {
    if (
      watchedState.link.status === status.invalid
    ) {
      watchedState.link.submit = submit.enabled;
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.link.status = status.validation;
  });

  document.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('[data-bs-toggle="modal"], li [target="_blank"]');
    if (targetBtn) {
      const btnId = targetBtn.getAttribute('data-id');
      watchedState.modalWindow.id = btnId;
      watchedState.modalWindow.status = status.render;
    }
  });
};

export default app;
