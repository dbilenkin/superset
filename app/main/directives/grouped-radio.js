'use strict';
angular.module('main')
.directive('groupedRadio', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      model: '=ngModel',
      value: '=groupedRadio'
    },
    link: function(scope, element, attrs, ngModelCtrl) {
      var buttonCssClass = 'button-positive';
      if (attrs.ngModel == '$ctrl.cardsPerSet') {
          buttonCssClass = 'button-calm';
      } else if (attrs.ngModel === '$ctrl.gameMode') {
          buttonCssClass = 'button-balanced';
      }
      element.addClass('button button-light');
      element.on('click', function(e) {
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(scope.value);
        });
      });

      scope.$watch('model', function(newVal) {
        element.removeClass(buttonCssClass);
        if (newVal == scope.value) {
          element.addClass(buttonCssClass);
        }
      });
    }
  };
})