'use strict';

(function () {

    function ScoresCtrl($scope, $stateParams, $rootScope, $window, Score) {
        var vm = this;
        vm.scoreHeight = $window.innerHeight - 200;
        vm.gameType = 'levels';
        vm.gameMode = 'race';
        if ($stateParams.gameType) {
            if ($stateParams.gameType != 'levels') {
                vm.gameMode = 'time trial';
                var cardsPerSetIndex = $stateParams.gameType.length - 1;
                vm.setType = $stateParams.gameType.substring(0, cardsPerSetIndex);
                vm.cardsPerSet = $stateParams.gameType.substring(cardsPerSetIndex);
            }
            vm.gameType = $stateParams.gameType; 
        }
        
        
        vm.scores = Score.getScores(vm.gameType);
        
        vm.changeGame = function() {
            
            var gameType = vm.setType + vm.cardsPerSet;
            
            if (vm.gameMode === 'race') {
                vm.setType = '';
                vm.cardsPerSet = '';
                gameType = 'levels';
                
            } else {
                if (vm.setType === '') {
                    vm.setType = 'Subset';
                    vm.cardsPerSet = '3';
                }
            }
        
            vm.scores = Score.getScores(gameType);

        }

        $scope.$watch(
            function($scope) {
            return vm.setType;
            }, function(newVal, oldVal) {
                console.log('changed game type: ' + newVal);
                vm.changeGame();
            }
        );
        
        $scope.$watch(
            function($scope) {
            return vm.cardsPerSet;
            }, function(newVal, oldVal) {
                console.log('cards per set: ' + newVal);
                vm.changeGame();
            }
        );
        
        $scope.$watch(
            function($scope) {
            return vm.gameMode;
            }, function(newVal, oldVal) {
                console.log('game mode: ' + newVal);
                vm.changeGame();
            }
        );
        
        
        vm.resetScores = function() {

            Score.resetScores(vm.setType + vm.cardsPerSet);
            vm.scores = Score.getScores(vm.setType + vm.cardsPerSet);
        }
        
        vm.resetAll = function() {

            Score.resetAllScores();
            vm.scores = Score.getScores(vm.setType + vm.cardsPerSet);
        }

    }

    angular.module('main')
        .controller('ScoresCtrl', ScoresCtrl);

})()

