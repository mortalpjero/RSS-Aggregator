import { status } from '../../utils/constants';

const usePost = () => {
  const viewPosts = (state, mainContainer, i18n) => {
    const copyMainContainer = mainContainer;
    const container = document.createElement('div');
    container.classList.add('card', 'border-0');

    const titleContainer = document.createElement('div');
    titleContainer.classList.add('card-body');

    const mainHeading = document.createElement('h2');
    mainHeading.classList.add('card-title', 'h4');
    mainHeading.textContent = i18n.t('posts');

    titleContainer.append(mainHeading);

    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'border-0', 'rounded-0');

    state.RSSLinks.posts.forEach((post) => {
      const postsItem = document.createElement('li');
      postsItem.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
        'border-0',
        'border-end-0',
      );

      const link = document.createElement('a');
      if (post.clicked === status.clicked) {
        link.classList.add('fw-normal', 'link-secondary');
      }
      if (post.clicked === null) {
        link.classList.add('fw-bold');
      }
      link.setAttribute('data-id', post.id);
      link.setAttribute('href', post.link);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.textContent = post.title;

      const btn = document.createElement('button');
      btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      btn.setAttribute('data-id', post.id);
      btn.setAttribute('type', 'button');
      btn.setAttribute('data-bs-toggle', 'modal');
      btn.setAttribute('data-bs-target', '#modal');
      btn.textContent = i18n.t('watch');

      postsItem.append(link, btn);
      postsList.append(postsItem);
    });

    container.append(titleContainer, postsList);
    copyMainContainer.innerHTML = '';
    copyMainContainer.append(container);
  };

  return { viewPosts };
};

export default usePost;
