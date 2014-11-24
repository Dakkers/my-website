var blog = angular.module('blog', [
    'ngRoute',
    'ngSanitize',
    'blogControllers',
    'blogServices',
]);

blog.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../../views/blogIndex.html',
            controller: 'PostsCtrl'
        })
        .when('/:field?/:data1?/:data2?', { // specific post
            templateUrl: '../../views/blogIndex.html',
            controller: 'PostsCtrl'
        });
    }
]);