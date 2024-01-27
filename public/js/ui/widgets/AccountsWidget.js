/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element || !(element instanceof Element)) {
      throw new Error('Invalid element provided to AccountsWidget constructor');
    }

    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccountButton = document.querySelector('.create-account');
    if (createAccountButton) {
      createAccountButton.addEventListener('click', () => {
        const modal = App.getModal('createAccount');
        if (modal) {
          modal.open();
        }
      });
    }
    this.element.addEventListener('click', (event) => {
      const target = event.target.closest('.account');
      if (target) {
        this.onSelectAccount(target);
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const currentUser = User.current();
    if (currentUser) {
      Account.list({}, (err, accountList) => {
        if (!err) {
          this.clear();
          accountList.forEach(item => this.renderItem(item));
        } else {
          console.error('Error fetching accounts:', err);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = document.querySelectorAll('.account');
    accounts.forEach(account => account.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const accounts = document.querySelectorAll('.account');
    accounts.forEach(account => account.classList.remove('active'));
    element.classList.add('active');
    const accountId = element.dataset.id;
    App.showPage('transactions', { id: accountId });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    const li = document.createElement('li');
    li.classList.add('account');
    li.setAttribute('data-id', item.id);
    const a = document.createElement('a');
    a.setAttribute('href', '#');

    const nameSpan = document.createElement('span');
    const sumSpan = document.createElement('span');
    nameSpan.textContent = item.name;
    sumSpan.textContent = `${item.sum.toFixed(2)} ₽`;

    a.appendChild(nameSpan);
    a.appendChild(document.createTextNode(' / '));
    a.appendChild(sumSpan);

    li.appendChild(a);

    return li.outerHTML;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(item) {
    const accountHTML = this.getAccountHTML(item);
    this.element.insertAdjacentHTML('beforeend', accountHTML);
  }
}
