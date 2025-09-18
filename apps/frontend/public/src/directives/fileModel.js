// src/directives/fileModel.js
angular.module('app').directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    // Pega o primeiro arquivo selecionado
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);