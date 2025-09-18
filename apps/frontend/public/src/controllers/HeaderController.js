angular.module("app").controller("HeaderController", [
  "$scope",
  "$uibModal",
  "AuthService",
  "$window",
  "$location",
  function ($scope, $uibModal, AuthService, $window, $location) {
    $scope.isLoggedIn = AuthService.isAuthenticated();
    $scope.user = $scope.isLoggedIn ? jwt_decode(AuthService.getToken()) : null;
    $scope.search = {
      query: $location.search().search || "",
    };

    $scope.performSearch = function () {
      if ($scope.search.query) {
        // Modifica o parâmetro 'search' na URL
        $location.search("search", $scope.search.query);
      } else {
        // Se a busca estiver vazia, remove o parâmetro da URL
        $location.search("search", null);
      }
    };

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
        .then(function (result) {
          // O modal de login foi fechado com sucesso (usuário logou)
          if (result && result.token) {
            $scope.loginSuccess(result.token);
          }
        })
        .catch(function (reason) {
          console.log("Modal de login dispensado:", reason);
        });
    };

    $scope.openRegisterModal = function () {
      var modalInstance = $uibModal.open({
        templateUrl: "src/views/register.html",
        controller: "ModalRegisterController",
        resolve: {
          // Permite que o modal de registro possa chamar a função de abrir o de login
          switchModal: function () {
            return $scope.openLoginModal;
          },
        },
      });

      modalInstance.result
        .then(function (result) {
          // O modal de registro foi fechado com sucesso (usuário registrou e logou)
          if (result && result.token) {
            $scope.registerSuccess(result.token);
          }
        })
        .catch(function (reason) {
          console.log("Modal de registro dispensado:", reason);
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
        templateUrl: "src/views/postModal.html", // O HTML do nosso modal
        controller: "PostController", // O controller do nosso modal
        size: "lg",
        resolve: {
          postEdit: function () {
            return null;
          },
        },
      });

      // O modal retorna uma "promessa". O .then() é executado quando o modal é fechado com sucesso.
      modalInstance.result
        .then(
          function (newPost) {
            // 'newPost' é o dado que o PostController nos enviou ao fechar.
            console.log("Post criado com sucesso:", newPost);

            // Ação simples: Recarrega a página para ver o novo post no feed.
            // Uma solução mais avançada seria adicionar o post ao topo do feed sem reload.
            $window.location.reload();
          },
          function () {
            // Esta função é chamada se o modal for dispensado (clicando fora ou no botão 'cancelar')
            console.log("Modal dispensado.");
          }
        )
        .catch(function (reason) {
          console.log("Modal de criação de post dispensado:", reason);
        });
    };
  },
]);
