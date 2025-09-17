angular.module("app").controller("FeedController", [
  "$scope",
  "PostService",
  "$window",
  function ($scope, PostService, $window) {
    $scope.posts = [];
    $scope.loading = false;
    $scope.cursor = null;
    $scope.error = null;
    $scope.hasMorePosts = true;

    $scope.loadPosts = function () {
      if ($scope.loading || !$scope.hasMorePosts) return;
      
      $scope.loading = true;
      $scope.error = null;

      PostService.getPosts($scope.cursor).then((res) => {
        if (res.data && res.data.posts && res.data.posts.length > 0) {
          $scope.posts = $scope.posts.concat(res.data.posts);
          $scope.cursor = res.data.nextCursor;
          if ($scope.cursor) {
            $scope.hasMorePosts = true;
          }
        } else {
            $scope.hasMorePosts = false;
        }
      }).catch((error) => {
        console.error("Erro ao buscar posts: ", error);
        $scope.error = "Não foi possível carregar os posts. Verifique o console para mais detalhes."
      }).finally(() => {
        $scope.loading = false;
      });
    };

    $scope.loadPosts();

    angular.element($window).bind("scroll", function () {
      if (
        $window.innerHeight + $window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        $scope.$apply($scope.loadPosts);
      }
    });
  },
]);
