angular.module("app").controller("PostViewController", [
    "$scope",
    "PostService",
    "$routeParams",
    function ($scope, PostService, $routeParams) {
      $scope.post = null;
      $scope.loading = true;
      $scope.error = null;
  
      const postId = $routeParams.postId;
  
      PostService.getPost(postId)
        .then(function(response) {
          $scope.post = response.data;
        })
        .catch(function(err) {
          console.error("Error fetching post:", err);
          $scope.error = "Could not load the post. It may not exist or an error occurred.";
        })
        .finally(function() {
          $scope.loading = false;
        });
    },
  ]);