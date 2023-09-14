import _ from 'lodash';

// Утилиты

const findItemById = (items, id) => items.find((item) => item.id === id);

const updateLinkStatusAndError = (linkState, status, error) => {
  const copyLinkState = linkState;
  copyLinkState.link.status = status;
  copyLinkState.link.error = error;
};

const genPosts = (DOM) => {
  const allPosts = DOM.querySelectorAll('item');
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

export {
  findItemById,
  updateLinkStatusAndError,
  genPosts,
};
