import axios from 'axios';

// Логика парсинга RSS данных и получение их через ссылку

const parser = new DOMParser();

const requestDOM = (url) => {
  const addProxy = (originUrl) => {
    const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
    proxyUrl.searchParams.set('url', originUrl);
    proxyUrl.searchParams.set('disableCache', 'true');
    return proxyUrl.toString();
  };

  const getData = (link) => {
    const urlContent = addProxy(link);
    return axios.get(urlContent)
      .then((urlData) => urlData.data.contents)
      .then((content) => parser.parseFromString(content, 'text/xml'));
  };

  return getData(url);
};

export default requestDOM;
