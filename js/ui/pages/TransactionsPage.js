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
  constructor( element ) {
    if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      throw new Error('Error: element is not exist or empty');
    }
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
    this.element.addEventListener('click', event => {

      if (event.target.closest('.transaction__remove')) {
        let transactionId = event.target.closest('.transaction__remove').dataset.id;
        this.removeTransaction(transactionId);
      }

      if (event.target.closest('.remove-account')) {
        if (document.querySelector('.active')) {
          const accountId = document.querySelector('.active').dataset.id;
          this.removeAccount(accountId);
        }
      }

    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      let confirmDialog = confirm('Вы действительно хотите удалить счёт?');

      if (confirmDialog) {
        Account.remove(options, {}, (err, data) => {
  
          if (data.success) {
            this.clear();
            App.update();
          } else if (err) {
            console.log(`Error: ${err}`);
          }
        });
      }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction( id ) {
    if (id) {
      let confirmDialog = confirm('Вы действительно хотите удалить эту транзакцию?');

      if (confirmDialog) {
        Transaction.remove(id, {}, (err, data) => {
          
          if (data.success) {
            App.update();
          } else if (err) {
            console.log(`Error: ${err}`);
          }
        });
      }
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render( options ) {
    if (options) {
      this.lastOptions = options;

      Account.get(options.account_id, {}, (err, data) => {

        if(data) {
          this.renderTitle(data.data.name);
        } else if (err) {
          console.log(`Error: ${err}`);
        }
      });

      Transaction.list(options, (err, data) => {
        if(data) {
          this.renderTransactions();
          this.renderTransactions(data.data);
        } else if (err) {
          console.log(`Error: ${err}`);
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions();
    this.renderTitle('Название счёта');
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle( name ) {
    document.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate( date ) {
    let currentDate = new Date(date);
    let months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
    
    const day = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
    const month = months[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours() < 10 ? `0${currentDate.getHours()}` : currentDate.getHours();
    const minutes = currentDate.getMinutes() < 10 ? `0${currentDate.getMinutes()}` : currentDate.getMinutes();

    return (`${day} ${month} ${year} г. в ${hours}:${minutes}`);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML( item ) {
    return `
    <div class="transaction transaction_${item.type} row">
          <div class="col-md-7 transaction__details">
              <div class="transaction__icon">
                  <span class="fa fa-money fa-2x"></span>
              </div>
              <div class="transaction__info">
                  <h4 class="transaction__title">${item.name}</h4>
                  <div class="transaction__date">${this.formatDate(item.date)}</div>
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
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions( data ) {
    const contentField = document.querySelector('.content');

    if (data) {
      for (let i = 0; i < data.length; i++) {
        contentField.insertAdjacentHTML('beforeend', this.getTransactionHTML(data[i]));
      }
    } else {
      contentField.innerHTML = '';
    }
  }
}