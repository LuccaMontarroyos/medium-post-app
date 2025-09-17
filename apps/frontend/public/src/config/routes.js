angular.module("app")
.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "src/views/home.html",
            controller: "FeedController"
        })
        .otherwise({ redirectTo: "/" });
});