angular.module('app').controller('ModalRegisterController', [
    '$scope', '$uibModalInstance', 'AuthService', 'switchModal',
    function($scope, $uibModalInstance, AuthService, switchModal) {
      $scope.user = { name: '', email: '', password: '' };
      $scope.error = '';
      $scope.loading = false;
  
      $scope.register = function() {
        $scope.loading = true;
        AuthService.register($scope.user)
          .then(function(res) {
            $scope.loading = false;
            $uibModalInstance.close(res.data);
          })
          .catch(function(err) {
            $scope.loading = false;
            $scope.error = err.data.message || 'Erro no cadastro';
          });
      };
  
      $scope.closeModal = function() {
        $uibModalInstance.dismiss('cancel');
      };
  
      $scope.switchToLogin = function() {
        $uibModalInstance.dismiss();
        switchModal();
      };
    }
  ]);
  