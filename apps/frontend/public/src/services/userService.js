angular.module('app')
.service('UserService', ['$http', function($http) {
    const API = 'http://localhost:3333';

    this.updateUser = function (userData) {
        return $http.put(`${API}/users`, userData);
    }

}])