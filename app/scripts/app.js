'use strict';

/**
 * @ngdoc overview
 * @name ownerchangefrontendApp
 * @description
 * # ownerchangefrontendApp
 *
 * Main module of the application.
 */
angular
    .module('ownerchangefrontendApp', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ownerchangefrontendApp.api',
        "angucomplete-alt",
        'ui.bootstrap'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
