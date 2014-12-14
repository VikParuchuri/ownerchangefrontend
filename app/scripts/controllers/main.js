'use strict';

/**
 * @ngdoc function
 * @name ownerchangefrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ownerchangefrontendApp
 */
angular.module('ownerchangefrontendApp')
  .controller('MainCtrl', function ($scope, api, $timeout) {
        $scope.meta = {};
        $scope.selectedTeam = undefined;
        $scope.selectedTeamPeople = undefined;
        $scope.selectedTeamWins = undefined;
        $scope.selectedTeamColors = undefined;
        $scope.selectedTextClass = undefined;
        $scope.selectedOwner = undefined;
        $scope.selectedGM = undefined;
        $scope.selectedCoach = undefined;
        $scope.startingOwner = undefined;
        $scope.startingGM = undefined;
        $scope.startingCoach = undefined;
        $scope.showLeaderInputs = false;
        $scope.winState = "none";

        api.getMeta().then(function(data){
            $scope.meta = data;
            $scope.teamInfo = $scope.meta.team_info;
            $scope.owners = data.positions.owners;
            $scope.gms = data.positions.gms;
            $scope.coaches = data.positions.coaches;
            for(var i=0;i<$scope.teamInfo.length;i++){
                var item = $scope.teamInfo[i];
                if(item.name == "Tampa Bay Buccaneers"){
                    item.image = "images/logos/tampa-bay-buccaneers.png";
                }
            }
        });

        api.getTeamColors().then(function(data){
           $scope.teamColors = data;
        });

        var getPersonObject = function(type, name){
            var searchList;
          if(type == "coach"){
              searchList = $scope.coaches;
          } else if (type == "gm"){
              searchList = $scope.gms;
          } else if(type == "owner"){
              searchList = $scope.owners;
          }

            for(var i=0;i<searchList.length;i++){
                var item = searchList[i];
                if(item.name === name){
                    return JSON.parse(JSON.stringify(item));
                }
            }
            return {}
        };

        var updateWins = function(type, val){
            var gm;
            var owner;
            var coach;
            if(type == "gm-select"){
                gm = val;
            } else {
                gm = $("#gm-select input").val();
            }
            if(type == "coach-select"){
                coach = val;
            } else {
                coach = $("#coach-select input").val();
            }

            if(type == "owner-select"){
                owner = val;
            } else {
                owner = $("#owner-select input").val();
            }


            if($scope.selectedTeamWins != undefined){
                var coachID = $scope.meta.names_to_ids[coach];
                var gmID = $scope.meta.names_to_ids[gm];
                var ownerID = $scope.meta.names_to_ids[owner];
                if(coachID == undefined && gmID == undefined && ownerID == undefined){
                    coachID = $scope.startingCoach.id;
                    gmID = $scope.startingGM.id;
                    ownerID = $scope.startingOwner.id;
                }

                if(coachID != undefined && ownerID != undefined && gmID != undefined) {
                    var id = coachID + "_" + gmID + "_" + ownerID + "_" + $scope.selectedTeam.originalObject.code;
                    var newWins = $scope.selectedTeamWins[id];

                    var startID = $scope.startingCoach.id + "_" + $scope.startingGM.id + "_" + $scope.startingOwner.id + "_" + $scope.selectedTeam.originalObject.code;
                    var startWins = $scope.selectedTeamWins[startID];

                    console.log(newWins);
                    console.log(startWins);
                    console.log(id);
                    console.log(startID);
                    if (newWins != undefined && startWins != undefined) {
                        $scope.newWins = newWins;
                        $scope.startWins = startWins;
                        console.log(startWins);
                        var diff = $scope.newWins - $scope.startWins;
                        if(diff < - 1){
                            $scope.winState = "much_worse";
                            $scope.winText = "much worse (lose more than one more game a season)"
                        } else if (diff < - .5) {
                            $scope.winState = "worse";
                            $scope.winText = "worse (lose an extra 1/2 game a season)"
                        } else if (diff < -.25){
                            $scope.winState = "moderately_worse";
                            $scope.winText = "moderately worse (lose an extra 1/4 game a season)"
                        } else if (diff < 0){
                            $scope.winState = "slightly_worse";
                            $scope.winText = "slightly worse (lose less than 1/4 more games a season)"
                        } else if (diff < .25){
                            $scope.winState = "slightly_better";
                            $scope.winText = "slightly better (win less than 1/4 more games a season)"
                        } else if (diff < .5){
                            $scope.winState = "moderately_better";
                            $scope.winText = "moderately better (win an extra 1/4 game a season)"
                        } else if (diff < 1){
                            $scope.winState = "better";
                            $scope.winText = "better (win an extra 1/2 game a season)";
                        } else {
                            $scope.winState = "much_better";
                            $scope.winText = "much better (win more than one more game a season)"
                        }
                        if ($scope.startingCoach.id == coachID && $scope.startingGM.id == gmID && $scope.startingOwner.id == ownerID) {
                            $scope.winState = "original";
                        }
                    } else {
                        $scope.winState = "invalid";
                    }
                }
            } else {
                console.log("undefined wins");
            }
        };

        $scope.updateWins = updateWins;

        var updateWinData = function(code){
            api.getTeamInfo(code).then(function(data){
                    $scope.selectedTeamWins = data;
                    $scope.showLeaderInputs = true;
            });
        };

        $scope.$watch('selectedTeam', function (newValue) {
            if($scope.selectedTeam != undefined){
                var code = $scope.selectedTeam.originalObject.code;
                $scope.selectedTeamPeople = $scope.meta.current_positions[code];

                $scope.startingOwner = getPersonObject("owner", $scope.selectedTeamPeople.owner);
                $scope.startingGM = getPersonObject("gm", $scope.selectedTeamPeople.gm);
                $scope.startingCoach = getPersonObject("coach", $scope.selectedTeamPeople.coach);

                $scope.showLeaderInputs = false;
                $scope.winState = "original";
                var name = $scope.selectedTeam.originalObject.name;
                var colors = $scope.teamColors[name];
                var teamColors = [];
                var textClasses = [];
                var shareColors = [];
                for(var i=0;i<4;i++){
                    var ind = i;
                    if(colors.length <= i){
                        ind = i - colors.length;
                    }
                    teamColors.push("#" + colors[ind]);
                    if(colors[ind] == "FFFFFF"){
                        textClasses.push(["color", "color-white", 'text-center']);
                    } else {
                        textClasses.push(["color", "color-black", "text-center"]);
                    }
                }
                var count = 0;
                while(count < 4){
                    var ind = JSON.parse(JSON.stringify(count));
                    while(colors.length <= ind){
                        console.log(ind);
                        ind = ind - colors.length;
                    }

                    if(colors[ind] != "FFFFFF") {
                        console.log(count);
                        shareColors.push("#" + colors[ind]);
                    }
                    count = count + 1;
                }
                $scope.selectedTeamColors = teamColors;
                $scope.selectedTextClass = textClasses;
                $scope.selectedTeamShareColors = shareColors;
                updateWinData(code);
            } else {
                $scope.selectedTeamPeople = undefined;
            }
        }, true);

        $scope.$watch('selectedOwner', function(oldValue, newValue){
            if(newValue != undefined) {
                updateWins("owner", newValue.name);
            }
        }, true);

        $scope.$watch('selectedGM', function(oldValue, newValue){
            if(newValue != undefined) {
                updateWins("gm", newValue.name);
            }
        }, true);

        $scope.$watch('selectedCoach', function(oldValue, newValue){
            if(newValue != undefined) {
                updateWins("coach", newValue.name);
            }
        }, true);
  });
