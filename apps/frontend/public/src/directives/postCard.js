angular.module("app").directive("postCard", function () {
  return {
    restrict: "E",
    scope: {
      post: "=",
      onEdit: "&",
      onRemove: "&",
      onToggleLike: "&",
    },
    templateUrl: "src/views/partials/postCard.html",
  };
});
