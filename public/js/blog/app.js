var blog = angular.module('blog', [
    'ngRoute',
    'ngSanitize',
    'blogControllers',
    'blogServices',
]);

blog.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    
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