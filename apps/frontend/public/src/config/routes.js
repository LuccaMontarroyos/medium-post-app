angular.module("app")
.config(function($routeProvider, $httpProvider) {
    
    $httpProvider.interceptors.push('AuthInterceptor');

    $routeProvider
        .when("/", {
            templateUrl: "src/views/home.html",
            controller: "FeedController"
        })
        .when("/posts/:postId", {
            templateUrl: "src/views/postView.html",
            controller: "PostViewController"
          })
        .otherwise({ redirectTo: "/" });
});