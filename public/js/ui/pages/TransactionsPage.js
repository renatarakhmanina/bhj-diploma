
/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element || !(element instanceof Element)) {
      throw new Error('Invalid element provided to TransactionsPage constructor');
    }

    this.element = element;
    this.registerEvents();
    this.lastOptions = null;
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.querySelector('.remove-account').addEventListener('click', () => {
      if (this.lastOptions) {
        this.removeAccount();
      }
    });

    this.element.addEventListener('click', (event) => {
      if (event.target && event.target.classList.contains('transaction__remove')) {
        const transactionId = event.target.dataset.id;
        if (transactionId) {
          this.removeTransaction(transactionId);
        }
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) return;

    if (confirm('Вы действительно хотите удалить счёт?')) {
      const accountId = this.lastOptions.account_id;
      Account.remove({id: accountId }, (err, response) => {
        if (response && response.success) {
          this.clear();
          App.updateWidgets();
          App.updateForms();
        } else {
          console.error('Account removing error:', err);
        }
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(transactionId) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove({ id: transactionId }, (err, response) => {
        if (response && response.success) {
          App.update();
        } else {
          console.error('Transaction removing error:', err);
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) return;
    this.lastOptions = options;

    Account.get(options.account_id, (err, accountName) => {
      if (accountName) {
        this.renderTitle(accountName);
      } else {
        console.error('Fetching error:', err);
      }
    });

    const accountId = this.lastOptions.account_id;
    Transaction.list({ account_id: accountId }, (err, transactions) => {
      if (transactions) {
        this.renderTransactions(transactions);
      } else {
        console.error('Error fetching transactions:', err);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.element.querySelector('.content').innerHTML = '';
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const accountTitle = document.querySelector('.content-title');
    accountTitle.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const dateOfCreate = new Date(date);
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    return dateOfCreate.toLocaleDateString('ru-RU', options);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const formattedDate = this.formatDate(item.created_at);
    const transactionType = item.type.toLowerCase() === 'income' ? 'transaction_income' : 'transaction_expense';

    const html = `
            <div class="transaction ${transactionType} row">
              <div class="col-md-7 transaction__details">
                <div class="transaction__icon">
                  <span class="fa fa-money fa-2x"></span>
                </div>
                <div class="transaction__info">
                  <h4 class="transaction__title">${item.name}</h4>
                  <div class="transaction__date">${formattedDate}</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="transaction__summ">
                  ${item.sum} <span class="currency">₽</span>
                </div>
              </div>
              <div class="col-md-2 transaction__controls">
                <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                  <i class="fa fa-trash"></i>  
                </button>
              </div>
            </div>
          `;
    return html;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    if (!data || !Array.isArray(data)) return;

    const contentSection = this.element.querySelector('.content');
    if (contentSection.childNodes.length > 0) {
      contentSection.innerHTML = '';
    }
    data.forEach(transaction => {
      const transactionHTML = this.getTransactionHTML(transaction);
      contentSection.insertAdjacentHTML('beforeend', transactionHTML);
    });
  }
}