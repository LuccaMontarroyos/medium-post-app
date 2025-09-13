angular.module('app', ['ngRoute', 'ui.bootstrap'])
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/feed.html',
      controller: 'FeedController'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginController'
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegisterController'
    })
    .otherwise({ redirectTo: '/' });
});