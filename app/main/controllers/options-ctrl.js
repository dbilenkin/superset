'use strict';
angular.module('main')
.controller('OptionsCtrl', function ($scope, $rootScope, $stateParams, Score) {
    
    var vm = this;
    
    Score.initScore();
    
    vm.gameMode = $stateParams.gameMode || 'timed';
    vm.gameModeTitle = vm.gameMode == 'timed' ? 'Time Trial' : 'Free Play';
    
    vm.setType = 'Set';
    vm.numAttributes = 4;
    vm.NUMCARDS = 12;
    vm.cardsPerSet = 3;
    vm.gameType = vm.setType + vm.cardsPerSet;

    vm.attributeKeys = ['shape', 'pattern', 'number', 'color', 'background'];
    
    vm.changeGame = function() {
        
      vm.numAttributes = vm.setType == 'Subset' ? 3 : vm.setType == 'Set' ? 4 : 5;
      
      $rootScope.numAttributes = vm.numAttributes;
      $rootScope.setType = vm.setType;
      $rootScope.NUMCARDS = vm.NUMCARDS;
      $rootScope.attributeKeys = vm.attributeKeys.slice(0, +vm.numAttributes);
      $rootScope.attributes = vm.attributes;
      $rootScope.cardsPerSet = +vm.cardsPerSet
      $rootScope.gameType = vm.setType + vm.cardsPerSet;
      $rootScope.gameMode = vm.gameMode;

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

});
