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
        log(1);
    });

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

    $scope.keyPressed = function (event) {
        if (event.which == 37) {
            selectPreviousImage();
        } else if (event.which == 39) {
            selectNextImage();
        }
    };

    $scope.carouselLoaded = function(elementId) {
        setCarouselElement(elementId);

        carouselElement.on('slid.bs.carousel', function () {
            var imageIndex = carouselElement.find('div.active').index() + 1;
            log(imageIndex);
        });
    };

    $scope.screenSize = function () {
        return screen.width + " x " + screen.height;
    };

    function goToUrlForPage(pageId) {
        $location.path('/' + pageId)
    }

    /**
     * Images
     */
    var carouselElement;

    function setCarouselElement(elementId) {
        var element = document.getElementById(elementId);
        if (!element) {
            throw new Error('Element \'#' + elementId + '\'  is undefined.');
        }

        carouselElement = $(element);
    }

    function getCarouselElement() {
        if (!carouselElement) {
            throw new Error('Carousel element is not set.');
        }

        return carouselElement;
    }

    function selectNextImage() {
        getCarouselElement().carousel("next");
    }

    function selectPreviousImage() {
        getCarouselElement().carousel("prev");
    }


    function log(currentImageIndex) {
        var screenDimension = screen.width + " x " + screen.height;
        writeLogEntry(
            authenticatedUser,
            $location.absUrl(),
            $window.navigator.userAgent,
            screenDimension,
            'Image-' + currentImageIndex
        );
    }
});


var DEFAULT_PAGE_ID = 'home';

var pages = [
    {id: 'login', pageUri: 'app/pages/login.html', open: true},
    {id: 'home', pageUri: 'app/pages/home.html', open: false}
];


function isAuthenticated() {
    return authenticatedUser
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