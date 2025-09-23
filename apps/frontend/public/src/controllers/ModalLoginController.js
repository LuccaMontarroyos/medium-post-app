angular.module('app').controller('ModalLoginController', [
    '$scope', '$uibModalInstance', 'AuthService', 'switchModal',
    function($scope, $uibModalInstance, AuthService, switchModal) {
      $scope.user = { email: '', password: '' };
      $scope.error = '';
      $scope.loading = false;
  
      $scope.login = function() {
        $scope.loading = true;
        AuthService.login($scope.user)
          .then(function(res) {
            $scope.loading = false;
            $uibModalInstance.close(res.data);
          })
          .catch((err) => {
            $scope.loading = false;
            $scope.error = err.message || 'Erro no login';
          });
      };
  
      $scope.switchToRegister = function() {
        $uibModalInstance.dismiss();
        switchModal();
      };
  
      $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
      };
    }
  ]);
  