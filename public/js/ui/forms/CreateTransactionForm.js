/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */

  renderAccountsList() {
    const accountsSelect = this.element.querySelector('.accounts-select');
    Account.list({}, (err, accounts) => {
      if (accounts) {
        accountsSelect.innerHTML = '';
        accounts.forEach(account => {
          const option = document.createElement('option');
          option.value = account.id;
          option.textContent = account.name;
          accountsSelect.appendChild(option);
        });
      } else {
        console.error('Error fetching accounts:', err);
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response && response.success) {
        this.element.reset();
        App.update();
        const modalElement = this.element.closest('.modal');
        const modalId = modalElement.dataset.modalId;
        const modal = App.getModal(modalId);
        if (modal) {
          modal.close();
        }
      } else {
        console.error('Error creating transaction:', err);
      }
    });
  }
}