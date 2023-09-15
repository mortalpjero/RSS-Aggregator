const useModal = () => {
  const viewModal = (state) => {
    const title = document.querySelector('.modal-title');
    const description = document.querySelector('.modal-body');
    const article = document.querySelector('.full-article');
    title.textContent = state.modalWindow.title;
    description.textContent = state.modalWindow.description;
    article.setAttribute('href', state.modalWindow.url);
  };

  return { viewModal };
};

export default useModal;
