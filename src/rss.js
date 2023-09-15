import _ from 'lodash';
import { status } from './utils/constants';
import { updateLinkStatusAndError } from './utils/utils';
import fetchRSS from './adapters/fetchRSS';
import usePostStore from './post/store/usePostStore';
import useFeedStore from './feeds/store/useFeedStore';
import view from './view';

// функции для работы с RSS данными

const generateRSSInfo = (response, watchedState) => {
  const newWatchedState = { ...watchedState };
  const { genPosts } = usePostStore();
  const { genFeed } = useFeedStore();

  const { feedInstance, postUniqueId } = genFeed(response, watchedState);

  const newPosts = [];

  const allPosts = genPosts(response);
  allPosts.forEach((post) => {
    const modifiedPost = { ...post, feedId: postUniqueId };
    newPosts.push(modifiedPost);
  });

  newWatchedState.RSSLinks.posts = [...newPosts, ...newWatchedState.RSSLinks.posts];

  newWatchedState.RSSLinks.status = status.render;
  newWatchedState.RSSLinks.feeds.unshift(feedInstance);
};

const getRSS = (watchedState, i18n) => {
  const newWatchedState = { ...watchedState };
  fetchRSS(newWatchedState.link.toBeChecked)
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
  getRSS,
  validateAndUpdateWatchedState,
};
