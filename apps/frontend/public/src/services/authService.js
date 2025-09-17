angular.module('app')
.service('AuthService', ['$http', function($http) {
    const API = 'http://localhost:3333';

    this.login = function(credentials) {
        return $http.post(`${API}/login`, credentials);
    }

    this.register = function(userData) {
        return $http.post(`${API}/users`, userData);
    }

    this.saveToken = function(token) {
        localStorage.setItem('jwtToken', token);
    }

    this.getToken = function() {
        return localStorage.getItem('jwtToken');
    }

    this.logout = function() {
        localStorage.removeItem('jwtToken');
    }

    this.isAuthenticated = function() {
        return !!localStorage.getItem('jwtToken');
    }
}])