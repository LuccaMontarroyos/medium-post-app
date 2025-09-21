angular.module("app").controller("HeaderController", [
  "$scope",
  "$uibModal",
  "AuthService",
  "$window",
  "$location",
  "$document",
  function ($scope, $uibModal, AuthService, $window, $location, $document) {
    $scope.isLoggedIn = AuthService.isAuthenticated();
    $scope.user = $scope.isLoggedIn ? jwt_decode(AuthService.getToken()) : null;
    $scope.search = {
      query: $location.search().search || "",
    };
    $scope.showUserMenu = false;

    $scope.performSearch = function () {
      if ($scope.search.query) {

        $location.search("search", $scope.search.query);
      } else {

        $location.search("search", null);
      }
    };

    $scope.toggleUserMenu = function (event) {
      event.stopPropagation();
      $scope.showUserMenu = !$scope.showUserMenu;
    }

    $document.on("click", function() {
      if ($scope.showUserMenu) {
        $scope.$apply(function() {
          $scope.showUserMenu = false;
        })
      }
    })

    $scope.$on('$destroy', function() {
      $document.off('click');
    })

    $scope.logout = function () {
      AuthService.logout();
      $window.location.reload();
    };

    $scope.openLoginModal = function () {
      var modalInstance = $uibModal.open({
        templateUrl: "src/views/login.html",
        controller: "ModalLoginController",
        resolve: {
          switchModal: function () {
            return $scope.openRegisterModal;
          },
        },
      });

      modalInstance.result
        .then((result) => {
          
          if (result && result.token) {
            $scope.loginSuccess(result.token);
          }
        })
        .catch((reason) => {
          console.error("Modal de login dispensado:", reason);
        });
    };

    $scope.openRegisterModal = function () {
      var modalInstance = $uibModal.open({
        templateUrl: "src/views/register.html",
        controller: "ModalRegisterController",
        resolve: {
          
          switchModal: function () {
            return $scope.openLoginModal;
          },
        },
      });

      modalInstance.result
        .then((result) => {
          
          if (result && result.token) {
            $scope.registerSuccess(result.token);
          }
        })
        .catch((reason) => {
          console.error("Modal de registro dispensado:", reason);
        });
    };

    $scope.loginSuccess = function (token) {
      AuthService.saveToken(token);
      $scope.isLoggedIn = true;
      $scope.user = jwt_decode(token);
    };

    $scope.registerSuccess = function (token) {
      AuthService.saveToken(token);
      $scope.isLoggedIn = true;
      $scope.user = jwt_decode(token);
    };

    $scope.openCreatePostModal = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "src/views/postModal.html",
        controller: "PostController",
        size: "lg",
        resolve: {
          postEdit: function () {
            return null;
          },
        },
      });

      
      modalInstance.result
        .then(
          function (newPost) {
            $window.location.reload();
          }
        )
        .catch(function (reason) {
          console.error("Modal de criação de post dispensado:", reason);
        });
    };

    $scope.openEditProfileModal = function() {
      var modalInstance = $uibModal.open({
        templateUrl: 'src/views/editProfileModal.html',
        controller: 'EditProfileController',
        size: 'lg',
        windowClass: 'custom-profile-modal',
        resolve: {
          userEdit: function() {
            return $scope.user;
          }
        }
      });

      modalInstance.result.then((updatedUser) => {
        $window.location.reload();
      });
    };
  },
]);
