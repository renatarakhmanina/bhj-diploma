/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, response) => {
      if (response && response.success) {
        this.element.reset();
        App.update();
        const modal = App.getModal('createAccount');
        if (modal) {
          modal.close();
        }
      } else {
        console.error('Error creating account:', err);
      }
    })
  }
}