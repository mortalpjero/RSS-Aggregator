import _ from 'lodash';
import fetchRSS from '../../adapters/fetchRSS';
import { status } from '../../utils/constants';

const usePostStore = () => {
  const postState = {
    posts: [],
  };

  const genPosts = (response) => {
    const allPosts = response.querySelectorAll('item');
    const processedPosts = Array.from(allPosts).map((singleItem) => {
      const postTitle = singleItem.querySelector('title');
      const postDescription = singleItem.querySelector('description');
      const postLink = singleItem.querySelector('link');
      return {
        title: postTitle.textContent,
        description: postDescription.textContent,
        link: postLink.textContent,
        id: _.uniqueId(),
        clicked: null,
      };
    });

    return processedPosts;
  };

  const updatePosts = (watchedState) => {
    const copyState = { ...watchedState };
    const updateInterval = 5000;

    const promises = copyState.RSSLinks.feeds.map(({ id, url }) => fetchRSS(url)
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

  return { postState, genPosts, updatePosts };
};

export default usePostStore;
