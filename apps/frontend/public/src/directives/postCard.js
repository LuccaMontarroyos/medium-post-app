angular.module('app').directive('postCard', function() {
    return{
       restrict: 'E',
        scope: {
            post: '=',
        },
        templateUrl: "src/views/partials/postCard.html"
    }
})