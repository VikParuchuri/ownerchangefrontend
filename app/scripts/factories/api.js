'use strict';

angular.module('ownerchangefrontendApp.api', ["ownerchangefrontendApp.config"])
    .factory('api', function ($http, $q, settings) {

        var getURL = function(url){
            var deferred = $q.defer();
                $http.get(url).
                    success(function(data, status, headers, config){
                        deferred.resolve(data);
                    }).
                    error(function(data, status, headers, config){
                        deferred.reject(data);
                    });
                return deferred.promise;
        };

        return {
            getMeta: function () {
                return getURL("data/meta.json?version=" + settings.version);
            },
            getTeamColors: function(){
                return getURL("data/team-colors.json?version=" + settings.version);
            },
            getTeamInfo: function(code){
                return getURL("data/teams/" + code + ".json?version=" + settings.version);
            }
        };
    });