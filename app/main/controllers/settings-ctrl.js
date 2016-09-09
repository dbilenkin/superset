'use strict';

(function () {

    function SettingsCtrl($stateParams, $rootScope, Score) {
        var vm = this;
        
        $rootScope.soundOn = true;
        $rootScope.setting2 = false;
        $rootScope.setting3 = true;


    }

    angular.module('main')
        .controller('SettingsCtrl', SettingsCtrl);

})()

