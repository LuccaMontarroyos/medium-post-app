angular.module("app").controller("AuthController", [
  "$scope",
  "AuthService",
  "$uibModal",
  function ($scope, AuthService, $uibModal) {
    $scope.isLoggedIn = AuthService.isAuthenticated();
    $scope.user = $scope.isLoggedIn ? jwt_decode(AuthService.getToken()) : null;

    console.log($scope.user);
    $scope.logout = function () {
      AuthService.logout();
      $scope.isLoggedIn = false;
      $scope.user = null;
    };

    $scope.openLoginModal = function () {
      document.activeElement.blur();

      var modalInstance = $uibModal.open({
        templateUrl: "src/views/login.html",
        controller: "ModalLoginController",
        // controllerAs: "$ctrl",
        resolve: {
          switchModal: function() { return $scope.openRegisterModal; }
        }
      });

      modalInstance.result
        .then(function (user) {
          if (user) {
            AuthService.saveToken(user.token);
            $scope.isLoggedIn = true;
            $scope.user = jwt_decode(user.token);
          }
        }).catch(function(reason){
          console.log('Modal dismissed:', reason);
      });
    };

    $scope.closeLoginModal = function () {
      $uibModal.close();
    };

    $scope.openRegisterModal = function () {
      document.activeElement.blur();

      var modalInstance = $uibModal.open({
        templateUrl: "src/views/register.html",
        controller: "ModalRegisterController",
        // controllerAs: "$ctrl",
        resolve: {
          switchModal: function() { return $scope.openLoginModal; }
        }
      });

      modalInstance.result
        .then(function (user) {
          if (user) {
            AuthService.saveToken(user.token);
            $scope.isLoggedIn = true;
            $scope.user = jwt_decode(user.token);
          }
        }).catch(function(reason){
          
          console.log('Modal dismissed:', reason);
      });
    };

    $scope.loginSuccess = function (user) {
      AuthService.saveToken(user.token);
      $scope.isLoggedIn = true;
      $scope.user = jwt_decode(user.token);
    };

    $scope.registerSuccess = function (user) {
      AuthService.saveToken(user.token);
      $scope.isLoggedIn = true;
      $scope.user = jwt_decode(user.token);
    };
  },
]);
