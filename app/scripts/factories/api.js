'use strict';

angular.module('ownerchangefrontendApp.api', [])
    .factory('api', function ($http, $q) {

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
                return getURL("data/meta.json");
            },
            getTeamColors: function(){
                return getURL("data/team-colors.json");
            },
            getTeamInfo: function(code){
                return getURL("data/teams/" + code + ".json");
            }
        };
    });