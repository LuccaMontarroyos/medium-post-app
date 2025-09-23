angular.module("app").service("UserService", [
  "$http",
  "APP_CONFIG",
  function ($http, APP_CONFIG) {
    const API = APP_CONFIG.API_URL;

    this.updateUser = function (userData) {
      const token = localStorage.getItem('jwtToken');
      return $http.put(`${API}/users`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    };
  },
]);
