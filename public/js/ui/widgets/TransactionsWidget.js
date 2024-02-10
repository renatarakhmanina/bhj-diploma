/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element || !(element instanceof Element)) {
      throw new Error('Invalid element provided to TransactionsWidget constructor');
    }

    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const incomeButton = document.querySelector('.create-income-button');
    const expenseButton = document.querySelector('.create-expense-button');

    if (incomeButton) {
      incomeButton.addEventListener('click', () => {
        const modal = App.getModal('newIncome');
        if (modal) {
          modal.open();
        }
      });
    }

    if (expenseButton) {
      expenseButton.addEventListener('click', () => {
        const modal = App.getModal('newExpense');
        if (modal) {
          modal.open();
        }
      });
    }
  }
}
