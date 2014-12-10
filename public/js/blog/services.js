var blogServices = angular.module('blogServices', ['ngResource']);

blogServices.factory('Posts', ['$resource',
    function ($resource) {
        return $resource('/blog/api/:field/:data1/:data2', {
            field: '@field',
            data1: '@data1',
            data2: '@data2'
        }, {query: { method: 'GET', isArray: true } });
    }
]);

blogServices.factory('Sidebar', [ '$resource',
    function ($resource) {
        return $resource('/blog/api/sidebar');
    }
]);
