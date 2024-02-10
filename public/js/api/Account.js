/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = '/account';
  /**
   * Получает информацию о счёте.
   * @param {number} id - Идентификатор записи.
   * @param {function} callback - Функция обратного вызова.
   */

  static get(id = '', callback) {
    const urlWithId = `${this.URL}/${id}`;
    createRequest({
      url: urlWithId,
      method: 'GET',
      callback: (err, response) => {
        if (response && response.success) {
          const accountName = response.data.name; 
          if (typeof callback === 'function') {
            callback(null, accountName);
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
}
