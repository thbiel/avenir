---
    # Front Matter enabled
---

var app = angular.module('app', ['ngRoute']);


app.config(
    ['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/:page?', {
            templateUrl: function (params) {
                var page = resolvePage(params);

                if (!page.open && !isAuthenticated()) {
                    return pagesById['login'].pageUri;
                }

                return page.pageUri;
            }
        }).otherwise({
            redirectTo: '/'
        });
    }]
);


app.controller('AppController', function ($scope, $routeParams, $route, $location, $window) {
    $scope.rp = $routeParams;

    $scope.currentPageCollection = pages;

    $scope.selectPageById = function (pageId) {
        goToUrlForPage(pageId);
    };

    $scope.$on('$routeChangeSuccess', function () {
        $scope.currentPageId = resolvePage($routeParams).id;
        log();
    });

    $scope.keyPressed = function (event) {
        if (event.which == 37) {
            $scope.selectPreviousImage();
        } else if (event.which == 39) {
            $scope.selectNextImage();
        }
    };

    $scope.showWrongPasswordMessage = false;

    $scope.passwordChanged = function () {
        $scope.showWrongPasswordMessage = false;
    };

    $scope.login = function (password) {
        var success = password && (password.trim().toLowerCase() === 'marzar' || password.trim().toLowerCase() === 'thb');

        if (success) {
            authenticatedUser = password;
            $route.reload();
        } else {
            $scope.showWrongPasswordMessage = true;
        }
    };

    function goToUrlForPage(pageId) {
        $location.path('/' + pageId)
    }

    function log() {
        writeLogEntry(
            authenticatedUser,
            $location.absUrl(),
            $window.navigator.userAgent,
            'Image-' + currentImageIndex
        );
    }


    /**
     * Images
     */
    var currentImageIndex = 0;
    $scope.currentImageUri = images[currentImageIndex].uri;

    function selectImage(index) {
        currentImageIndex = index;
        $scope.currentImageUri = images[currentImageIndex].uri;
        log();
    }

    $scope.selectImageById = function (id) {
        $scope.currentImageUri = imagesById[id].uri;
    };

    $scope.selectNextImage = function () {

        if (currentImageIndex < images.length - 1) {
            selectImage(currentImageIndex + 1);
        }
    };

    $scope.selectPreviousImage = function () {
        if (currentImageIndex > 0) {
            selectImage(currentImageIndex - 1);
        }
    };
});


var DEFAULT_PAGE_ID = 'home';

var pages = [
    {id: 'login', pageUri: 'app/pages/login.html', open: true},
    {id: 'home', pageUri: 'app/pages/home.html', open: false}
];


function isAuthenticated() {
    return !authenticatedUser
}

var authenticatedUser;


function mapPageUriById(pages) {
    var map = {};
    angular.forEach(pages, function (page) {
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


/**
 * Images
 */
var images = [
{% for image in site.data.images.images %}
    {id: '{{image.id}}', uri: '{{image.uri}}'},
{% endfor %}
];


function mapById(list) {
    var map = {};
    angular.forEach(list, function (it) {
        map[it.id] = it;
    });
    return map;
}

var imagesById = mapById(images);
