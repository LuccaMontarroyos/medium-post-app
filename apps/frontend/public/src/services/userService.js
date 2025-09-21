import { APP_CONFIG } from "../config/env";

angular.module("app").service("UserService", [
  "$http",
  function ($http) {
    const API = APP_CONFIG.API_URL;

    this.updateUser = function (userData) {
      const token = localStorage.getItem('jwtToken');
      return $http.put(`${API}/users`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    };
  },
]);
