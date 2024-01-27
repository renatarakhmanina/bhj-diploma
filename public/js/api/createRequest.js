/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  try {
    // определение типа запроса и настройка данных
    if (options.method === 'GET' && options.data) {
      const queryParams = Object.keys(options.data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(options.data[key]))
        .join('&');
      options.url += '?' + queryParams;
    } else if (options.method !== 'GET' && options.data) {
      const formData = new FormData();
      for (const key in options.data) {
        formData.append(key, options.data[key]);
      }
      options.data = formData;
    }
    xhr.open(options.method, options.url);
    xhr.send(options.data);
    
  } catch (e) {
    // перехват ошибки
    if (options.callback) {
      options.callback(e, null);
    }
    return;
  }

  // обработка успешного завершения запроса
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      if (xhr.response) {
        options.callback(null, xhr.response);
      } else {
        options.callback(new Error('Empty response'), null);
      }
    } else {
      options.callback(new Error(`Request failed with status ${xhr.status}`), null);
    }
  });

  // обработчик события ошибки
  xhr.addEventListener('error', () => {
    options.callback(new Error('Request failed'), null);
  });
};
