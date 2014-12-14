'use strict';

/**
 * @ngdoc function
 * @name dsfrontendApp.controller:HeaderCtrl
 * @description
 * # AboutCtrl
 * Controller of the dsfrontendApp
 */
angular.module('ownerchangefrontendApp')
    .controller('HeaderCtrl', function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    });