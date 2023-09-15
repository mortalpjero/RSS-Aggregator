// Константы для описывания статуса

const status = {
  valid: 'valid',
  invalid: 'invalid',
  validation: 'validation',
  render: 'render',
  rendered: 'rendered',
  empty: 'empty',
  clicked: 'clicked',
  typing: 'typing',
  update: 'update',
};

const submit = {
  enabled: 'enabled',
  disabled: 'disabled',
};

const PROXY_URL_PATH = '/get';
const PROXY_BASE_URL = 'https://allorigins.hexlet.app';
const DISABLE_CACHE_PARAM = 'disableCache';
const DISABLE_CACHE_VALUE = 'true';
const URL_PARAM = 'url';
const XML_CONTENT_TYPE = 'text/xml';

export {
  status,
  submit,
  PROXY_BASE_URL,
  PROXY_URL_PATH,
  DISABLE_CACHE_PARAM,
  DISABLE_CACHE_VALUE,
  URL_PARAM,
  XML_CONTENT_TYPE,
};
