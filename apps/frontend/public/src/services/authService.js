angular.module('app')
.service('AuthService', ['$http', "APP_CONFIG", function($http, APP_CONFIG) {
    const API = APP_CONFIG.API_URL;

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
        const token = this.getToken();
        if (!token) {
            return false;
        }
        try {
            const decodedToken = jwt_decode(token);
            
            const expirationDate = new Date(decodedToken.exp * 1000);
            const now = new Date();
            
            
            if (expirationDate < now) {
                console.log("Token expirado.");
                this.logout();
                return false;
            }

            return true;
        } catch (e) {
         
            console.error("Token inválido (erro ao decodificar).", e);
            this.logout();
            return false;
        }
    }
}])