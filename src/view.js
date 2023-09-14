import { status, submit } from './utils/constants';
// Обновления DOM через state

// Визуальное обновления Фидов

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

// Визуальное обновление постов

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

// Визуальное обновление модального окна

const viewModal = (state) => {
  const title = document.querySelector('.modal-title');
  const description = document.querySelector('.modal-body');
  const article = document.querySelector('.full-article');
  title.textContent = state.modalWindow.title;
  description.textContent = state.modalWindow.description;
  article.setAttribute('href', state.modalWindow.url);
};

// Логика визуальных обновлений

const view = (state, i18n) => {
  const linkInput = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');
  const submitBtn = document.querySelector('[type="submit"]');

  linkInput.classList.toggle('is-invalid', state.link.status === status.invalid);
  feedback.classList.toggle('text-danger', state.link.status === status.invalid);
  feedback.classList.toggle('text-success', state.link.status === status.valid);

  feedback.textContent = state.link.error;

  if (state.link.submit === submit.disabled) {
    submitBtn.setAttribute('disabled', true); // Disable the button
  } else {
    submitBtn.removeAttribute('disabled'); // Enable the button
  }

  if (
    state.RSSLinks.status === status.render
    || state.RSSLinks.status === status.update) {
    viewFeeds(state, feeds, i18n);
    viewPosts(state, posts, i18n);
  }

  if (state.modalWindow.status === status.render) {
    viewModal(state);
  }
};

export default view;
