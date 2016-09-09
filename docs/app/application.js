var app = angular.module('app', ['ngRoute']);


app.config(
    ['$routeProvider', function($routeProvider) {

    $routeProvider.
        when('/', {
            templateUrl: 'app/pages/home.html'
        }).
        when('/:page?', {
            templateUrl: function(params) {
                var page = resolvePage(params);

                if (!page.open && !loggedIn) {
                    return pagesById['login'].pageUri;
                }

                return page.pageUri;
            }
        }).
        otherwise({
            redirectTo: '/'
        });
    }]
);


app.controller('AppController', function ($scope, $routeParams, $route, $location, $window) {
    $scope.rp = $routeParams;

    $scope.currentPageCollection = pages;

    $scope.selectPageById = function(pageId) {
        goToUrlForPage(pageId);
    };

    $scope.$on('$routeChangeSuccess', function() {
        $scope.currentPageId = resolvePage($routeParams).id;
        console.log("URL: " + $location.absUrl() + " | " + window.navigator.userAgent);
    });

    $scope.keyPressed = function(event) {
        if (event.which == 37) {
            // Left arrow
        } else if (event.which == 39) {
            // Right arrow
        }
    };

    $scope.showWrongPasswordMessage = false;

    $scope.passwordChanged = function() {
        $scope.showWrongPasswordMessage = false;
    };

    $scope.login = function(password) {
        var success = password && password.trim().toLowerCase() === 'm';

        if (success) {
            loggedIn = true;
            $route.reload();
        } else {
            $scope.showWrongPasswordMessage = true;
        }
    };

    function goToUrlForPage(pageId) {
        $location.path('/' + pageId)
    }
});


var DEFAULT_PAGE_ID = 'home';

var pages = [
    {id: 'login', pageUri: 'app/pages/login.html', open: true},
    {id: 'home', pageUri: 'app/pages/home.html', open: false},
    {id: 'headings', pageUri: 'app/pages/headings.html', open: false},
    {id: 'type-on-screen', pageUri: 'app/pages/type-on-screen.html', open: false},
    {id: 'typecast-showcase', pageUri: 'app/pages/typecast-showcase.html', open: false}
];


var loggedIn = true;


function mapPageUriById(pages) {
    var map = {};
    angular.forEach(pages, function(page) {
        map[page.id] = page;
    });
    return map;
}

var pagesById = mapPageUriById(
    pages
);

function resolvePage(routeParams) {
    var id = routeParams['page'];
    if (id == null) {
        id = DEFAULT_PAGE_ID;
    }

    var page = pagesById[id];

    if (!page) {
        page = pagesById[DEFAULT_PAGE_ID];
    }

    return page;
}