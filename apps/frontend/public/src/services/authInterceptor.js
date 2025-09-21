angular.module('app')
.factory('AuthInterceptor', ['$q', '$window', '$location', '$injector', function($q, $window, $location, $injector) {
    return {
        responseError: function(rejection) {
            if (rejection.status === 401) {
                
                var AuthService = $injector.get('AuthService');
                
                AuthService.logout();
                
                $location.path('/');
                $window.location.reload();
            }
            
            return $q.reject(rejection);
        }
    };
}]);