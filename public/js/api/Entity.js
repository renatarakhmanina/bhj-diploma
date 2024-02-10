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
    createRequest({
      url: this.URL,
      data: data,
      method: 'GET',
      callback: (err, response) => {
        if (!err && response && response.success) {
          const list = response.data;
          if (typeof callback === 'function') {
            callback(null, list);
          }
        } else {
          console.error('Fetching error:', err);
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
    createRequest({
      url: this.URL,
      data: data,
      method: 'PUT',
      callback: (err, response) => {
        if (!err && response && response.success) {
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
    createRequest({
      url: this.URL,
      data: data,
      method: 'DELETE',
      callback: (err, response) => {
        if (!err && response && response.success) {
          if (typeof callback === 'function') {
            callback(null, response); 
          } else {
            console.error('Error removing account:', err);
            if (typeof callback === 'function') {
              callback(err, null);
            }
          }
        }
      }
    });
  }
}
