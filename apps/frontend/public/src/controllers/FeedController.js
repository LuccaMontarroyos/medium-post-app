angular.module("app").controller("FeedController", [
  "$scope",
  "PostService",
  "AuthService",
  "$window",
  "$uibModal",
  "$location",
  "$rootScope",
  function ($scope, PostService, AuthService, $window, $uibModal, $location, $rootScope) {
    $scope.posts = [];
    $scope.loading = false;
    $scope.cursor = null;
    $scope.error = null;
    $scope.hasMorePosts = true;
    $scope.isUserLoggedIn = AuthService.isAuthenticated();

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


    $scope.loadPosts(currentSearchTerm);


    var deregisterListener = $rootScope.$on(
      "$locationChangeSuccess",
      function () {
        var newSearchTerm = $location.search().search || null;


        if (newSearchTerm !== currentSearchTerm) {
          
          currentSearchTerm = newSearchTerm;


          $scope.posts = [];
          $scope.cursor = null;
          $scope.hasMorePosts = true;
          $scope.loadPosts(currentSearchTerm);
        }
      }
    );

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
        

        var index = $scope.posts.findIndex((p) => p.id === updatedPost.id);
        if (index !== -1) {
          $scope.posts[index] = updatedPost;
        }
      });
    };

    $scope.removePost = function (postToRemove) {
      var confirmation = window.confirm(
        "Tem certeza que deseja remover este post? Esta ação não pode ser desfeita."
      );

      if (confirmation) {
        PostService.deletePost(postToRemove.id)
          .then(function () {
            $scope.posts = $scope.posts.filter(function (post) {
              return post.id !== postToRemove.id;
            });
        
          })
          .catch(function (err) {
            console.error("Erro ao remover o post:", err);
            window.alert("Não foi possível remover o post. Tente novamente.");
          });
      }
    };

    $scope.toggleLike = function (post) {

      if (!$scope.isUserLoggedIn) {
        alert('Você precisa estar registrado para curtir o post');
        return;
      }
      
      const originalLikedState = post.isLikedByUser;
      const originalLikesCount = post.totalLikes;


      post.isLikedByUser = !post.isLikedByUser;
      if (post.isLikedByUser) {
        post.totalLikes++;
      } else {
        post.totalLikes--;
      }

      PostService.likePost(post.id)
        .then(function (response) {
          post.isLikedByUser = response.data.liked;
        
        })
        .catch(function (err) {
          
          console.error("Erro ao processar o like:", err);
          post.isLikedByUser = originalLikedState;
          post.totalLikes = originalLikesCount;
          window.alert("Não foi possível registrar seu like. Tente novamente.");
        });
    };

    angular.element($window).bind("scroll", function () {
      if (
        $window.innerHeight + $window.scrollY >=
          document.body.offsetHeight - 100
      ) {
        $scope.$apply(() => {
          var currentSearchTerm = $location.search().search || null;
          $scope.loadPosts(currentSearchTerm);
        });
      }
    });
  },
]);
