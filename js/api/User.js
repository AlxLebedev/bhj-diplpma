/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство HOST, равно значению Entity.HOST.
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    if(localStorage.getItem('user')) {
      localStorage.removeItem('user');
    }
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user'));
    } else {
      return undefined;
    }
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch( data, callback = f => f ) {
    if (data) {
      let currentUrl = this.URL + '/current';
      return createRequest(Object.assign({
        url: this.HOST + currentUrl,
        method: 'GET'
      },
      {data}),
      (err, data) => {
        if (!err && data.success) {
          this.setCurrent({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email
          });
        } else if (err) {
          this.unsetCurrent();
        }
        callback(err, data);
      });
    }
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login( data, callback = f => f ) {
    let currentUrl = this.URL + '/login';
    return createRequest(Object.assign({
      url: this.HOST + currentUrl,
      method: 'POST'
    },
    data),
    (err, data) => {
      if (!err && data.success) {
        this.setCurrent({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email
        });
      } else {
        console.log(`Authorization failed: ${err}`)
      }
      callback(err, data);
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register( data, callback = f => f ) {
    let currentUrl = this.URL + '/register';
    return createRequest(Object.assign({
      url: this.HOST + currentUrl,
      method: 'POST'
    },
    data),
    (err, data) => {
      if(!err && data.success) {
        this.setCurrent({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email
        });
      }
      callback(err, data);
    });
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout( data, callback = f => f ) {
    let url = this.URL + '/logout';
    return createRequest(Object.assign({
      url: this.HOST + url,
      method: 'POST'
    },
    data),
    (err, data) => {
      if(!err && data.success) {
        this.unsetCurrent();
        App.setState('init');
      }
      callback(err, data);
    });
  }
}

User.HOST = Entity.HOST;
User.URL = '/user';