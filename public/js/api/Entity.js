/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  static URL = '';
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list(data, callback) {
    const urlWithParams = `${this.URL}?${Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')}`;

    createRequest({
      url: urlWithParams,
      data: data,
      method: 'GET',
      callback: (err, response) => {
        if (response && response.success) {
          const accountList = response.data;
          if (typeof callback === 'function') {
            callback(null, accountList);
          }
        } else {
          console.error('Error fetching accounts:', err);
          if (typeof callback === 'function') {
            callback(err, null);
          }
        }
      }
    });
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    const urlWithParams = `${this.URL}?${Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')}`;

    createRequest({
      url: urlWithParams,
      data: data,
      method: 'PUT',
      callback: (err, response) => {
        if (response && response.success) {
          if (typeof callback === 'function') {
            callback(null, response); 
          }
        } else {
          console.error('Error creating account:', err);
          if (typeof callback === 'function') {
            callback(err, null);
          }
        }
      }
    });
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback) {
    const urlWithParams = `${this.URL}?${Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')}`;

    createRequest({
      url: urlWithParams,
      data: data,
      method: 'DELETE',
      callback: (err, response) => {
        if (typeof callback === 'function') {
          if (!err && response.success) {
            callback(null, response.data); 
          } else {
            console.error('Error removing account:', err);
            callback(err, null);
          }
        }
      }
    });
  }
}
