import _ from 'lodash';
import { status } from './utils/constants';
import { genPosts, updateLinkStatusAndError, findItemById } from './utils/utils';
import requestDOM from './getRequest';
import view from './view';

// функции для работы с RSS данными

const generateRSSInfo = (DOMTree, watchedState) => {
  const newWatchedState = { ...watchedState };
  const mainTitle = DOMTree.querySelector('title');
  const mainDescription = DOMTree.querySelector('description');
  const postUniqueId = _.uniqueId();
  const feedInstance = {
    id: postUniqueId,
    title: mainTitle.textContent,
    description: mainDescription.textContent,
    url: watchedState.link.toBeChecked,
  };
  const newPosts = [];

  const allPosts = genPosts(DOMTree);
  allPosts.forEach((post) => {
    const modifiedPost = { ...post, feedId: postUniqueId };
    newPosts.push(modifiedPost);
  });

  newWatchedState.RSSLinks.posts = [...newPosts, ...newWatchedState.RSSLinks.posts];

  newWatchedState.RSSLinks.status = status.render;
  newWatchedState.RSSLinks.feeds.unshift(feedInstance);
};

const updatePosts = (watchedState) => {
  const copyState = { ...watchedState };
  const updateInterval = 5000;

  const promises = copyState.RSSLinks.feeds.map(({ id, url }) => requestDOM(url)
    .then((response) => {
      const posts = genPosts(response);
      const currentPosts = watchedState.RSSLinks.posts.flat();
      const newPosts = _.differenceBy(posts, currentPosts, 'title')
        .map((newPost) => ({
          ...newPost,
          feedId: id,
          id: _.uniqueId(),
        }));

      copyState.RSSLinks.posts = [...newPosts, ...watchedState.RSSLinks.posts];
    })
    .then(() => {
      copyState.RSSLinks.status = status.update;
    }));

  return Promise.all(promises)
    .finally(() => {
      setTimeout(() => updatePosts(copyState), updateInterval);
    });
};

const getRSS = (watchedState, i18n) => {
  const newWatchedState = { ...watchedState };
  requestDOM(newWatchedState.link.toBeChecked)
    .then((DOM) => {
      const error = DOM.querySelector('parsererror');
      if (error) {
        updateLinkStatusAndError(newWatchedState, status.invalid, i18n.t('errors.invalidRSS'));
      } else {
        updateLinkStatusAndError(newWatchedState, status.valid, i18n.t('success'));
        newWatchedState.link.existingLinks.unshift(newWatchedState.link.toBeChecked);
        generateRSSInfo(DOM, newWatchedState);
      }
    })
    .catch(() => {
      updateLinkStatusAndError(newWatchedState, status.invalid, i18n.t('errors.networkError'));
    })
    .then(() => view(newWatchedState, i18n));
};

const modalSetting = (watchedState) => {
  const newWatchedState = { ...watchedState };
  const desiredEl = findItemById(newWatchedState.RSSLinks.posts, newWatchedState.modalWindow.id);
  desiredEl.clicked = status.clicked;
  newWatchedState.modalWindow.status = status.render;
  newWatchedState.modalWindow.title = desiredEl.title;
  newWatchedState.modalWindow.description = desiredEl.description;
  newWatchedState.modalWindow.url = desiredEl.link;
};

const validateAndUpdateWatchedState = (watchedState, validateLinkResult, i18n) => {
  const updatedWatchedState = { ...watchedState };

  if (!_.isEmpty(validateLinkResult)) {
    updateLinkStatusAndError(
      updatedWatchedState,
      status.invalid,
      validateLinkResult.linkContent.message,
    );
  } else if (
    updatedWatchedState.link.existingLinks.includes(updatedWatchedState.link.linkContent)
  ) {
    updateLinkStatusAndError(updatedWatchedState, status.invalid, i18n.t('errors.existingRSS'));
  } else {
    updateLinkStatusAndError(updatedWatchedState, status.valid, '');
    updatedWatchedState.link.toBeChecked = updatedWatchedState.link.linkContent;
  }

  return updatedWatchedState;
};

export {
  generateRSSInfo,
  updatePosts,
  getRSS,
  modalSetting,
  validateAndUpdateWatchedState,
};
