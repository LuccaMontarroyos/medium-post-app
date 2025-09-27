angular.module('app').controller('PostController', [
    '$scope',
    '$uibModalInstance',
    'AuthService',
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

        function getFormattedDateTime() {
            const now = new Date();        
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            return now.toISOString().slice(0, 16);
        }

        $scope.minDateTime = getFormattedDateTime();

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
            
            document.getElementById('file-upload').value = null;
        };
        
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
        
                    $uibModalInstance.close(response.data); 
                })
                .catch(function(err) {
        
                    console.error("Erro ao salvar o post:", err);
                    $scope.error = "Não foi possível salvar o post. Tente novamente.";
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