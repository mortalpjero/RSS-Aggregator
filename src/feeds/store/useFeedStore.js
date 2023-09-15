import _ from 'lodash';

const useFeedStore = () => {
  const feedState = {
    feeds: [],
  };

  const genFeed = (response, state) => {
    const mainTitle = response.querySelector('title');
    const mainDescription = response.querySelector('description');
    const feedUniqueId = _.uniqueId();
    const feedInstance = {
      id: feedUniqueId,
      title: mainTitle.textContent,
      description: mainDescription.textContent,
      url: state.link.toBeChecked,
    };

    return { feedInstance, feedUniqueId };
  };

  return { feedState, genFeed };
};

export default useFeedStore;
