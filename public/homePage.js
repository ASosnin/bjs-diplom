"use strict";

const logoutButton = new LogoutButton();

logoutButton.action = () => {
  ApiConnector.logout((data) => {
    if (data.success) {
      location.reload();
    } else {
      console.log('error: ', data.error);
    }
  })
}

ApiConnector.current((data) => {
  if (data.success) {
    ProfileWidget.showProfile(data.data)
  } else {
    console.log(data);
  }
})

const ratesBoard = new RatesBoard();

const getRates = () => {
  ApiConnector.getStocks((data) => {
    console.log('getStocks: ', data);
    if (data.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(data.data);
    }
  });
}
getRates();
const interval = setInterval(getRates, 60 * 1000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = ({currency, amount}) => {
  ApiConnector.addMoney({currency, amount}, (data) => {
    if (data.success) {
      moneyManager.setMessage(data.success, `Пополнение на ${amount} ${currency}`)
      ProfileWidget.showProfile(data.data);
    } else {
      moneyManager.setMessage(data.success, data.error)
    }
  });
}

moneyManager.conversionMoneyCallback = ({fromCurrency, fromAmount, targetCurrency}) => {
  ApiConnector.convertMoney({fromCurrency, fromAmount, targetCurrency}, (data) => {
    if (data.success) {
      moneyManager.setMessage(data.success, `Успешно конвертировано ${fromAmount} ${fromCurrency} в ${targetCurrency}`);
      ProfileWidget.showProfile(data.data);
    } else {
      moneyManager.setMessage(data.success, data.error)
    }
  });
}

moneyManager.sendMoneyCallback = ({to, currency, amount}) => {
  ApiConnector.transferMoney({to, currency, amount}, (data) => {
    if (data.success) {
      moneyManager.setMessage(data.success, `Успешно переведено ${amount} ${currency} юзеру с id: ${to}`);
      ProfileWidget.showProfile(data.data);
    } else {
      moneyManager.setMessage(data.success, data.error);
    }
  });
}

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((data) => {
  console.log(data);
  if (data.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(data.data);
    moneyManager.updateUsersList(data.data);
  } else {
    favoritesWidget.setMessage(data.error);
  }
});

favoritesWidget.addUserCallback = ({id, name}) => {
  ApiConnector.addUserToFavorites({id, name}, (data) => {
    if (data.success) {
      favoritesWidget.setMessage(data.success, `Добавлен пользователь ${name} c id: ${id}`)
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(data.data);
      moneyManager.updateUsersList(data.data);
    } else {
      favoritesWidget.setMessage(data.success, data.error);
    }
  });
}

favoritesWidget.removeUserCallback = (id) => {
  ApiConnector.removeUserFromFavorites(id, (data) => {
    if (data.success) {
      favoritesWidget.setMessage(data.success, `Пользователь c id: ${id} успешно удален из избранного`)
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(data.data);
      moneyManager.updateUsersList(data.data);
    } else {
      favoritesWidget.setMessage(data.success, data.error);
    }
  });
}
