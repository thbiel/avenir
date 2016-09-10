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
            $scope.selectPreviousImage();
        } else if (event.which == 39) {
            $scope.selectNextImage();
        }
    };

    $scope.showWrongPasswordMessage = false;

    $scope.passwordChanged = function() {
        $scope.showWrongPasswordMessage = false;
    };

    $scope.login = function(password) {
        var success = password && (password.trim().toLowerCase() === 'marzar' || password.trim().toLowerCase() === 't');

        if (success) {
            loggedIn = true;
            console.log("Logged in " + password);
            $route.reload();
        } else {
            $scope.showWrongPasswordMessage = true;
            console.log("Log in failed for " + password);
        }
    };

    function goToUrlForPage(pageId) {
        $location.path('/' + pageId)
    }

    /**
     * Images
     */
    var currentImageIndex = 0;
    $scope.currentImageUri = images[currentImageIndex].uri;

    function selectImage(index) {
        currentImageIndex = index;
        $scope.currentImageUri = images[currentImageIndex].uri;
    }

    $scope.selectImageById = function(id) {
        $scope.currentImageUri = imagesById[id].uri;
    };

    $scope.selectNextImage = function() {

        if (currentImageIndex < images.length - 1) {
            selectImage(currentImageIndex + 1);
        }
    };

    $scope.selectPreviousImage = function() {
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


/**
 * Images
 */
var images = [
    {id: 'image-08', uri: 'images/tor-haavard/IMG_1495.jpg'},
    {id: 'image-07', uri: 'images/tor-haavard/IMG_1492.jpg'},
    {id: 'image-06', uri: 'images/tor-haavard/IMG_1491.jpg'},
    {id: 'image-15', uri: 'images/tor-haavard/IMG_1593-2.jpg'},
    {id: 'image-01', uri: 'images/tor-haavard/30248-269.jpg'},
    {id: 'image-02', uri: 'images/tor-haavard/IMG_0423.jpg'},
    {id: 'image-03', uri: 'images/tor-haavard/IMG_0428.jpg'},
    {id: 'image-04', uri: 'images/tor-haavard/IMG_1474.jpg'},
    {id: 'image-05', uri: 'images/tor-haavard/IMG_1479.jpg'},
    {id: 'image-09', uri: 'images/tor-haavard/IMG_1513.jpg'},
    {id: 'image-10', uri: 'images/tor-haavard/IMG_1522.jpg'},
    {id: 'image-11', uri: 'images/tor-haavard/IMG_1526.jpg'},
    {id: 'image-12', uri: 'images/tor-haavard/IMG_1545.jpg'},
    {id: 'image-13', uri: 'images/tor-haavard/IMG_1548.jpg'},
    {id: 'image-14', uri: 'images/tor-haavard/IMG_1576.jpg'}
];


function mapById(list) {
    var map = {};
    angular.forEach(list, function(it) {
        map[it.id] = it;
    });
    return map;
}

var imagesById = mapById(images);
