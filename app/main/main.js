'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  'angular.filter',
  'ngStorage',
  'ngProgress'
  // TODO: load other modules selected during generation
])
  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


    // ROUTING with ui.router
    $urlRouterProvider.otherwise('/start');
    $stateProvider
      // this state is placed in the <ion-nav-view> in the index.html

      .state('scores', {
        cache: false,
        url: '/scores/:gameType',
        templateUrl: 'main/templates/scores.html',
        controller: 'ScoresCtrl as $ctrl',
        params: {
          'gameType': 'levels'
        }

      })
      .state('options', {
        cache: false,
        url: '/options/:gameMode',
        templateUrl: 'main/templates/options.html',
        controller: 'OptionsCtrl as $ctrl'

      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'main/templates/settings.html',
        controller: 'SettingsCtrl as $ctrl'

      })
      .state('howto', {
        cache: false,
        url: '/howto',
        templateUrl: 'main/templates/howto.html',
        controller: 'HowtoCtrl as $ctrl'

      })
      .state('game', {
        cache: false,
        url: '/game/:gameType',
        templateUrl: 'main/templates/game.html',
        controller: 'MainCtrl as $ctrl',
        params: {
          'gameType': 'levels'
        }
      })
      .state('start', {
        url: '/start',
        templateUrl: 'main/templates/start.html'
      });
  });
