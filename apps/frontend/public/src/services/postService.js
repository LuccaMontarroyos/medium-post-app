angular.module('app')
.service('PostService', ['$http', 'AuthService', function($http, AuthService) {
    const API = 'http://localhost:3333';

    this.getPosts = function(cursor, limit = 5) {
        let url = `${API}/posts?&limit=${limit}`
        if (cursor) {
            url+= `&cursor=${cursor}`;
        }
        return $http.get(url);
    };

    this.createPost = function(postData) {
        const token = localStorage.getItem('jwtToken');
        return $http.post(`${API}/posts`, postData, {
            headers: { Authorization: `Bearer ${token}`}
        });
    };

    this.likePost = function(postId) {
        const token = localStorage.getItem('jwtToken');
        return $http.post(`${API}/posts/${postId}/like`, {}, {
            headers: { Authorization: `Bearer ${token}`}
        });
    };

    this.updatePost = function(postId, postData) {
        return $http.put(`${API}/posts/${postId}`, postData);
    };

    this.deletePost = function(postId) {
        return $http.delete(`${API}/posts/${postId}`);
    };
}]);
