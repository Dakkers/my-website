var blogControllers = angular.module('blogControllers', ['ngSanitize']);

blogControllers.controller('PostsCtrl', ['$scope', '$sce', '$routeParams', '$timeout', '$location', 'Posts',
    function ($scope, $sce, $routeParams, $timeout, $location, Posts) {
        // for injecting html
        $scope.trustHTML = function(snippet) {
            return $sce.trustAsHtml(snippet);
        }

        $scope.singlePost = false;

        var field = $routeParams.field,
            data1 = $routeParams.data1,
            data2 = $routeParams.data2 || '',
            start, end;

        // determine how to call the API
        switch(field) {

            case undefined: // root
                field = 'posts';
                data1 = '1-10';
                break;

            case 'post':    // single post
                $scope.singlePost = true;
                field = 'posts';
                break;

            case 'page':    // posts 1-10, 11-20...
                $scope.singlePost = false;
                field = 'posts';
                start = (parseInt(data1) - 1)*10 + 1;
                end = start + 9;
                data1 = [start, end].join('-');
                break;

            case 'archive':
                // goto default...
            case 'topic':
                // goto default...
            default:
                $scope.singlePost = false;
                break;
        }

        Posts.query({field: field, data1: data1, data2: data2}, function(data) {
            if (!data[0]) {
                $timeout(function() {
                    $location.path('/');
                });
            } else {
                data.forEach(function(post) {
                    post.relativeDate = moment(post.date, 'YYYY-MM-DD').fromNow();
                    post.date = moment(post.date, 'YYYY-MM-DD').format('MMMM Do, YYYY');
                    post.content = ($scope.singlePost) ? post.content : post.content.slice(0,1);
                });
                $scope.posts = data;
            }
        });
    }
]);

blogControllers.controller('SidebarCtrl', ['$scope', 'Sidebar', 
    function ($scope, Sidebar) {
        $scope.moment = moment;

        Sidebar.get({}, function(result){
            $scope.sidebarData = result;
            $scope.dates = Object.keys(result.dates.data).reverse();
            $scope.topics = Object.keys(result.topics.data).sort(function alphaSort(a,b) {
                var A = a.toLowerCase(),
                    B = b.toLowerCase();
                return (A <= B) ? -1 : 1;
            });
        });
    }
]);