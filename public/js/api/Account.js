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
      callback: callback
    });
  }
}
