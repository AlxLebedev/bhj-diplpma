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
    if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      throw new Error('Error: element is not exist or empty');
    }
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const addIncomeBtn = this.element.querySelector('.create-income-button');
    const addExpenseBtn = this.element.querySelector('.create-expense-button');

    addIncomeBtn.addEventListener('click', () => {
      App.getModal('newIncome').open();
    });

    addExpenseBtn.addEventListener('click', () => {
      App.getModal('newExpense').open();
    });
  }
}
