angular.module('app').directive('postCard', function() {
    return{
       restrict: 'E',
        scope: {
            post: '=',
            onEdit: '&',
            onRemove: '&',
        },
        templateUrl: "src/views/partials/postCard.html"
    }
})