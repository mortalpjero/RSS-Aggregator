import constants from './utils/constants';
// Обновления DOM через state

const view = (state) => {
  const linkInput = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');

  if (state.link.status === constants.status.invalid) {
    linkInput.classList.add('is-invalid');
    feedback.textContent = state.link.error;
  }

  if (state.link.status === constants.status.valid) {
    linkInput.classList.remove('is-invalid');
    feedback.textContent = '';
  }
};

export default view;
