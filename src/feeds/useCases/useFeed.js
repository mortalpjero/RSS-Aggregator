const useFeeds = () => {
  const viewFeeds = (state, mainContainer, i18n) => {
    const copyMainContainer = mainContainer;
    const container = document.createElement('div');
    container.classList.add('card', 'border-0');

    const titleContainer = document.createElement('div');
    titleContainer.classList.add('card-body');

    const mainHeading = document.createElement('h2');
    mainHeading.classList.add('card-title', 'h4');
    mainHeading.textContent = i18n.t('feeds');

    titleContainer.append(mainHeading);

    const feedsList = document.createElement('ul');
    feedsList.classList.add('list-group', 'border-0', 'rounded-0');
    state.RSSLinks.feeds.forEach((feed) => {
      const feedsItem = document.createElement('li');
      feedsItem.classList.add('list-group-item', 'border-0', 'border-end-0');

      const feedTitle = document.createElement('h3');
      feedTitle.classList.add('h6', 'm-0');
      feedTitle.textContent = feed.title;

      const feedDescription = document.createElement('p');
      feedDescription.classList.add('m-0', 'small', 'text-black-50');
      feedDescription.textContent = feed.description;

      feedsItem.append(feedTitle, feedDescription);
      feedsList.append(feedsItem);
    });

    container.append(titleContainer, feedsList);
    copyMainContainer.innerHTML = '';
    copyMainContainer.append(container);
  };

  return { viewFeeds };
};

export default useFeeds;
