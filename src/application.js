import * as yup from 'yup';
import _ from 'lodash';
// import onChange from 'on-change';

const schema = yup.object().shape({
  linkContent: yup.string().url('Ссылка должна быть валидным URL').required(),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

const app = () => {
  const state = {
    link: {
      status: 'invalid',
      linkContent: '',
      existingLinks: [],
      error: '',
    },
  };

  const linkInput = document.querySelector('#url-input');
  const submit = document.querySelector('.rss-form');

  linkInput.addEventListener('input', (e) => {
    state.link.linkContent = e.target.value;
  });

  submit.addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.link.existingLinks.includes(state.link.linkContent)) {
      state.link.status = 'ivalid';
      state.link.error = 'RSS уже существует';
      console.log(state.link);
      return;
    }
    const validateLink = validate(state.link);
    if (_.isEmpty(validateLink)) {
      state.link.status = 'valid';
      state.link.error = '';
      state.link.existingLinks.push(state.link.linkContent);
    } else {
      state.link.status = 'invalid';
      state.link.error = validateLink.linkContent.message;
    }

    console.log(state.link);
  });
};

export default app;
