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
  constructor( element ) {
    if (element) {
      this.element = element;
      this.registerEvents();
      this.update();
    } else {
      throw new Error('Error: element is not exist or empty');
    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccountBtn = this.element.querySelector('.create-account');
    const accounts = this.element.querySelectorAll('.account');

    createAccountBtn.addEventListener('click', function(event) {
      event.preventDefault();
      App.getModal('createAccount').open();
    });

    for (let account of accounts) {
      account.addEventListener('click', function(event) {
        event.preventDefault();
        this.onSelectAccount(event.target);
      });
    }
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
    if (User.current()) {
      Account.list(User.current(), (err, dataResponse) => {
        if (dataResponse.success) {
          this.clear();
          const accounts = dataResponse.data;
          for (let i = 0; i < accounts.length; i++) {
            this.renderItem(dataResponse.data[i]);
          }
        } else {
          console.log(`Error: ${err}`);
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
    const currentAccounts = document.querySelectorAll('.account');
    for (let account of currentAccounts) {
      account.remove();
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const activeAccount = document.querySelector('.active.account');

    if (activeAccount) {
      activeAccount.classList.remove('active');
    }

    element.closest('.account').classList.add('active');

    this.currentAccountId = element.closest('.account').dataset.id;
    App.showPage("transactions", { account_id: this.currentAccountId });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML( item ) {
    const createdAccount = document.createElement('li');
    const accountName = item.name;
    const accountSum = item.sum;
    const accountId = item.id;
    
    createdAccount.className = 'account';
    createdAccount.dataset.id = accountId;
    createdAccount.innerHTML = `<a href = "#">
                                  <span>${accountName}</span>
                                  <span>${accountSum} ₽</span>
                                </a>`;
      
    createdAccount.addEventListener('click', (event) => {
      event.preventDefault();
      this.onSelectAccount(event.target);
    });

    return createdAccount;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem( item ) {
    this.element.insertAdjacentElement('beforeend', this.getAccountHTML(item));
  }
}
