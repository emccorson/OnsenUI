/**
 * @element ons-input
 */

(function(){
  'use strict';

  angular.module('onsen').directive('onsInput', function($parse, $timeout) {
    return {
      restrict: 'E',
      replace: false,
      scope: false,

      link: function(scope, element, attrs) {
        let el = element[0];
        var debounce;

        const onInput = () => {
          $parse(attrs.ngModel).assign(scope, el.type === 'number' ? Number(el.value) : el.value);
          attrs.ngChange && scope.$eval(attrs.ngChange);
          scope.$parent.$evalAsync();
        };

        if (attrs.ngModel) {
          scope.$watch(attrs.ngModel, (value) => {
            if (typeof value !== 'undefined' && value !== el.value) {
              el.value = value;
            }
          });

          element.on('input', () => {
            debounce && $timeout.cancel(debounce);
            const bouncy = attrs.ngModelOptions.debounce ? $parse(attrs.ngModelOptions)().debounce : 0;
            console.log("bouncing with " + bouncy);
            debounce = $timeout(onInput, bouncy);
          });
        }

        scope.$on('$destroy', () => {
          element.off('input', onInput)
          scope = element = attrs = el = null;
        });
      }
    };
  });
})();
