import { APP_CONFIG } from "../config/env";

angular.module('app')
.service('PostService', ['$http', 'AuthService', function($http, AuthService) {
    const API = APP_CONFIG.API_URL;

    this.getPosts = function(cursor, limit = 5, searchTerm = null) {
        const token = localStorage.getItem('jwtToken')
        let url = `${API}/posts?&limit=${limit}`
        if (cursor) {
            url+= `&cursor=${cursor}`;
        }
        if (searchTerm) {
            url+= `&search=${encodeURIComponent(searchTerm)}`;
        }
        return $http.get(url, {
            headers: token ? {Authorization: `Bearer ${token}`} : null
        });
    };

    this.createPost = function(postData) {
        var fd = new FormData();

        fd.append('title', postData.title);
        fd.append('text', postData.text);
        fd.append('resume', postData.resume);

        if (postData.imageFile) {
            fd.append('image', postData.imageFile, postData.imageFile.name);
        }
        const token = localStorage.getItem('jwtToken');
        return $http.post(`${API}/posts`, fd, {
            transformRequest: angular.identity,
            headers: { 
                'Content-Type': undefined,
                'Authorization': `Bearer ${token}`
            }
        });
    };

    this.likePost = function(postId) {
        const token = localStorage.getItem('jwtToken');
        return $http.post(`${API}/posts/${postId}/like`, {}, {
            headers: { Authorization: `Bearer ${token}`}
        });
    };

    this.updatePost = function(postId, postData) {
        const token = localStorage.getItem('jwtToken');

        const dataToSend = {
            title: postData.title,
            text: postData.text,
            resume: postData.resume,
        }
        return $http.put(`${API}/posts/${postId}`, dataToSend, {
            headers: { Authorization: `Bearer ${token}`}
        });
    };

    this.deletePost = function(postId) {
        const token = localStorage.getItem('jwtToken');
        return $http.delete(`${API}/posts/${postId}`, {
            headers: { Authorization: `Bearer ${token}`}
        });
    };
}]);
