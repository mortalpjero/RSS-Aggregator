// Утилиты

const findItemById = (items, id) => items.find((item) => item.id === id);

const updateLinkStatusAndError = (linkState, status, error) => {
  const copyLinkState = linkState;
  copyLinkState.link.status = status;
  copyLinkState.link.error = error;
};

export {
  findItemById,
  updateLinkStatusAndError,
};
