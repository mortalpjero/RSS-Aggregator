import { status, submit } from './utils/constants';
import usePost from './post/useCases/usePosts';
import useFeeds from './feeds/useCases/useFeed';
import useModal from './modal/useCases/useModal';

// Логика визуальных обновлений

const view = (state, i18n) => {
  const { viewFeeds } = useFeeds();
  const { viewPosts } = usePost();
  const { viewModal } = useModal();

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
