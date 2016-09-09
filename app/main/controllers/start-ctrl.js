'use strict';
angular.module('main')
.controller('StartCtrl', function ($scope, $rootScope, $ionicPlatform) {
    
    var vm = this;
    
    $ionicPlatform.ready(function () {
        
        var successCallback = function (user) {
            console.log(user);
        };
        
        var failureCallback = function (data) {
            console.log(data);
        };
        gamecenter.auth(successCallback, failureCallback);
        
    })
    
    $scope.achieve = function() {
        var data = {
            achievementId: '70271365',
            percent: '100'
        };
        gamecenter.reportAchievement(successCallback, failureCallback, data);
    };
 
    $scope.score = function() {
        var data = {
            score: 42,
            leaderboardId: 'set10sets'
        };
        gamecenter.submitScore(successCallback, failureCallback, data);
    };
 
    $scope.showGC = function() {
        var data = {
            leaderboardId: 'Set - 10 Sets'
        };
        gamecenter.showLeaderboard(successCallback, failureCallback, data);
    };
 
    $scope.resetGC = function() {
        gamecenter.resetAchievements(successCallback, failureCallback);
    };
    
    
    


});
