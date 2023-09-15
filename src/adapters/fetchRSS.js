import axios from 'axios';
import {
  PROXY_URL_PATH,
  PROXY_BASE_URL,
  DISABLE_CACHE_PARAM,
  DISABLE_CACHE_VALUE,
  URL_PARAM,
  XML_CONTENT_TYPE,
} from '../utils/constants';

const parser = new DOMParser();

const fetchRSS = (url) => {
  const addProxy = (originUrl) => {
    const proxyUrl = new URL(PROXY_URL_PATH, PROXY_BASE_URL);
    proxyUrl.searchParams.set(URL_PARAM, originUrl);
    proxyUrl.searchParams.set(DISABLE_CACHE_PARAM, DISABLE_CACHE_VALUE);
    return proxyUrl.toString();
  };

  const getData = (link) => {
    const urlContent = addProxy(link);
    return axios.get(urlContent)
      .then((urlData) => urlData.data.contents)
      .then((content) => parser.parseFromString(content, XML_CONTENT_TYPE));
  };

  return getData(url);
};

export default fetchRSS;
