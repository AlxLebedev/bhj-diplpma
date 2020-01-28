/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * Наследуется от AsyncForm
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor( element ) {
    super(element);
    this.element = element;
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    if (User.current()) {
      const dropDownList = document.querySelectorAll("select.accounts-select");

      Account.list(User.current(), (err, data) => {
  
        dropDownList.forEach(elem => elem.innerHTML = '');
  
        if (data.success) {
          let actualAccounts = data.data;
          for (let i = 0; i < actualAccounts.length; i++) {
            let accountsItem = actualAccounts[i];
            let option = `<option value="${accountsItem.id}">${accountsItem.name}</option>`;
            for (let listItem of dropDownList) {
              listItem.insertAdjacentHTML('beforeend', option);
            }
          }
        } else {
          console.log(`Error: ${err}`);
        }
      });
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit( options ) {
    Transaction.create(options, (err, data) => {

      if (data.success) {
        this.element.reset();

        // let modal = new Modal(this.element.closest('.modal'));
        // modal.close();
        new Modal(this.element.closest('.modal')).close();

        App.update();
      } else {
        alert(data.error);
        console.log(`Error: ${err}`);
        //return;
      }
    });
  }
}
