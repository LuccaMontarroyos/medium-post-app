angular.module("app").controller("FeedController", [
  "$scope",
  "PostService",
  "$window",
  "$uibModal",
  "$location",
  "$rootScope",
  function ($scope, PostService, $window, $uibModal, $location, $rootScope) {
    $scope.posts = [];
    $scope.loading = false;
    $scope.cursor = null;
    $scope.error = null;
    $scope.hasMorePosts = true;

    $scope.loadPosts = function (searchTerm) {
      if ($scope.loading || !$scope.hasMorePosts) return;
      
      $scope.loading = true;
      $scope.error = null;

      PostService.getPosts($scope.cursor, 5, searchTerm)
        .then((res) => {
          if (res.data && res.data.posts && res.data.posts.length > 0) {
            $scope.posts = $scope.posts.concat(res.data.posts);
            $scope.cursor = res.data.nextCursor;
            $scope.hasMorePosts = !!$scope.cursor;
          } else {
            $scope.hasMorePosts = false;
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar posts: ", error);
          $scope.error = "Não foi possível carregar os posts";
        })
        .finally(() => {
          $scope.loading = false;
        });
    };

    var currentSearchTerm = $location.search().search || null;

    // 1. Carga inicial
    $scope.loadPosts(currentSearchTerm);

    // 2. Ouvinte para MUDANÇAS na URL
    var deregisterListener = $rootScope.$on("$locationChangeSuccess", function () {
        var newSearchTerm = $location.search().search || null;

        // Só recarrega se o termo da busca realmente mudou
        if (newSearchTerm !== currentSearchTerm) {
            console.log("Termo de busca mudou, recarregando posts...");
            currentSearchTerm = newSearchTerm;
            
            // Reseta o feed antes de carregar os novos posts
            $scope.posts = [];
            $scope.cursor = null;
            $scope.hasMorePosts = true;
            $scope.loadPosts(currentSearchTerm);
        }
    });

    $scope.$on("$destroy", deregisterListener);

    $scope.openEditPostModal = function (postToEdit) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: "src/views/postModal.html",
        controller: "PostController",
        size: "lg",
        resolve: {
          postEdit: function () {
            return postToEdit;
          },
        },
      });

      modalInstance.result.then((updatedPost) => {
        console.log("Post atualizado com sucesso: ", updatedPost);

        var index = $scope.posts.findIndex((p) => p.id === updatedPost.id);
        if (index !== -1) {
          $scope.posts[index] = updatedPost;
        }
      });
    };

    $scope.removePost = function(postToRemove) {
      
      var confirmation = window.confirm('Tem certeza que deseja remover este post? Esta ação não pode ser desfeita.');
  
      if (confirmation) {
          PostService.deletePost(postToRemove.id)
              .then(function() {
                  
                  $scope.posts = $scope.posts.filter(function(post) {
                      return post.id !== postToRemove.id;
                  });
                  console.log('Post removido com sucesso!');
              })
              .catch(function(err) {
                  
                  console.error('Erro ao remover o post:', err);
                  window.alert('Não foi possível remover o post. Tente novamente.');
              });
      }
  };

    angular.element($window).bind("scroll", function () {
      if (
        $location.search().search &&
        $window.innerHeight + $window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        $scope.$apply(() => {
          $scope.loadPosts(null);
        });
      }
    });
  },
]);
