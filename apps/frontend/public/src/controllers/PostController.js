// src/controllers/PostController.js

angular.module('app').controller('PostController', [
    '$scope',
    '$uibModalInstance',
    'AuthService', // ESSENCIAL: Injetamos isso para controlar o modal (fechar/dispensar)
    'PostService',
    '$window',
    'postEdit',
    function ($scope, $uibModalInstance, AuthService, PostService, $window, postEdit) {
        const token = AuthService.getToken();
        $scope.user = token ? jwt_decode(token) : null;
        $scope.postData = {};
        $scope.isSaving = false;
        $scope.error = null;
        $scope.editMode = !!postEdit;
        $scope.modalTitle = $scope.editMode ? 'Update Post' : 'New Post';

        if ($scope.editMode) {
            $scope.postData = angular.copy(postEdit);
        }

        $scope.$watch('postData.imageFile', (newFile) => {
            if (newFile) {
                var reader = new $window.FileReader();

                reader.onload = function (e) {
                    $scope.$apply(() => {
                        $scope.imagePreviewUrl = e.target.result;
                    })
                }

                reader.readAsDataURL(newFile);
            }
        });

        $scope.removeImage = function() {
            $scope.postData.imageFile = null;
            $scope.imagePreviewUrl = null;
            // Limpa o valor do input de arquivo para permitir selecionar o mesmo arquivo novamente
            document.getElementById('file-upload').value = null;
        };
        // Função para salvar o post
        $scope.save = function () {
            if ($scope.isSaving) return;
            
            $scope.isSaving = true;
            $scope.error = null;

            var savePromise;

            if ($scope.editMode) {
                savePromise = PostService.updatePost($scope.postData.id, $scope.postData);
            } else {
                savePromise = PostService.createPost($scope.postData);
            }

            savePromise.then(function(response) {
                    // Sucesso! Fechamos o modal e passamos o post recém-criado de volta.
                    $uibModalInstance.close(response.data); 
                })
                .catch(function(err) {
                    // Erro! Exibimos a mensagem de erro no modal.
                    console.error("Erro ao salvar o post:", err);
                    $scope.error = "Não foi possível salvar o post. Tente novamente.";
                })
                .finally(function() {
                    $scope.isSaving = false;
                });
        };

        // Função para cancelar e fechar o modal
        $scope.cancel = function () {
            
            $uibModalInstance.dismiss('cancel');
        };
    }
]);