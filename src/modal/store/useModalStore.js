import { status } from '../../utils/constants';
import { findItemById } from '../../utils/utils';

const useModalStore = () => {
  const modalSetting = (watchedState) => {
    const newWatchedState = { ...watchedState };
    const desiredEl = findItemById(newWatchedState.RSSLinks.posts, newWatchedState.modalWindow.id);
    desiredEl.clicked = status.clicked;
    newWatchedState.modalWindow.status = status.render;
    newWatchedState.modalWindow.title = desiredEl.title;
    newWatchedState.modalWindow.description = desiredEl.description;
    newWatchedState.modalWindow.url = desiredEl.link;
  };

  return { modalSetting };
};

export default useModalStore;
