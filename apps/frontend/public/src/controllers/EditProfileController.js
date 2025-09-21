angular.module('app').controller('EditProfileController', [
    '$scope',
    '$uibModalInstance',
    'UserService',
    'userEdit',
    function ($scope, $uibModalInstance, UserService, userEdit) {

        
        $scope.userCopy = angular.copy(userEdit);
        $scope.passwords = {};

        $scope.isEditing = { name: false, email: false };
        $scope.showPasswordFields = false;
        $scope.passwordFieldTypes = { old: 'password', new: 'password', confirm: 'password' };
        
        $scope.error = null;
        $scope.success = null;
        $scope.isSaving = false;

        $scope.toggleEdit = function(field) {
            $scope.isEditing[field] = !$scope.isEditing[field];
        };
        
        
        $scope.togglePasswordFields = function() {
            $scope.showPasswordFields = !$scope.showPasswordFields;
        };

        
        $scope.togglePasswordVisibility = function(field) {
            $scope.passwordFieldTypes[field] = $scope.passwordFieldTypes[field] === 'password' ? 'text' : 'password';
        };

        
        $scope.save = function() {
            $scope.isSaving = true;
            $scope.error = null;
            $scope.success = null;
            
            let dataToUpdate = {
                name: $scope.userCopy.name,
                email: $scope.userCopy.email
            };

        
            if ($scope.showPasswordFields && $scope.passwords.oldPassword) {
                dataToUpdate.oldPassword = $scope.passwords.oldPassword;
                dataToUpdate.password = $scope.passwords.newPassword;
                dataToUpdate.confirmPassword = $scope.passwords.confirmPassword;
            }

            UserService.updateUser(dataToUpdate)
                .then(function(response) {
                    $scope.success = "Perfil atualizado com sucesso! A página será recarregada.";
        
                    setTimeout(() => $uibModalInstance.close(response.data), 1500);
                })
                .catch(function(err) {
                    $scope.error = err.data.error || "Senhas divergentes.";
                })
                .finally(function() {
                    $scope.isSaving = false;
                });
        };

        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
]);
