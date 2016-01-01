/**
 * AngularJS directive that simulates the effect of typing on a text editor - with a blinking cursor.
 * This directive works as an attribute to any HTML element, and it changes the speed/delay of its animation.
 *
 * There's also a simple less file included for basic styling of the dialog, which can be overridden.
 * The config object also lets the user define custom CSS classes for the modal.
 *
 *  How to use:
 *
 *  Just add the desired text to the 'text' attribute of the element and the directive takes care of the rest.
 *  The 'text' attribute can be a single string or an array of string. In case an array is passed, the string
 *  on each index is erased so the next item can be printed. When the last index is reached, that string stays
 *  on the screen. (So if you want to erase the last string, just push an empty string to the end of the array)
 *
 * These are the optional preferences:
 *  - initial delay: set an 'initial-delay' attribute for the element
 *  - type delay: set a 'type-delay' attribute for the element
 *  - turn off cursor blinking: set the 'blink-cursor' attribute  to "false"
 *  - cursor blinking speed: set a 'blink-delay' attribute for the element
 *
 * Note:
 * Each time/delay value should be set either on seconds (1s) or milliseconds (1000)
 *
 * Dependencies:
 * The directive needs the css file provided in order to replicate the cursor blinking effect.
 */

angular.module('angularTypewrite')

    .directive('typewrite', ['$timeout', function ($timeout) {
        function linkFunction (scope, iElement, iAttrs) {
          var timer = null,
            initialDelay = iAttrs.initialDelay ? getTypeDelay(iAttrs.initialDelay) : 200,
            typeDelay = iAttrs.typeDelay ? getTypeDelay(iAttrs.typeDelay) : 200,
            blinkDelay = iAttrs.blinkDelay ? getAnimationDelay(iAttrs.blinkDelay) : false,
            cursor = iAttrs.cursor ? iAttrs.cursor : '|',
            blinkCursor = iAttrs.blinkCursor ? iAttrs.blinkCursor === "true" : true,
            auxStyle;
          if (iAttrs.text) {
            timer = $timeout(function() {
              updateIt(iElement, 0, iAttrs.text);
            }, initialDelay);
          }

          function updateIt(element, i, text){
            if (i <= text.length) {
              element.html(text.substring(0, i) + cursor);
              i++;
              timer = $timeout(function() {
                updateIt(iElement, i, text);
              }, typeDelay);
              return;
            } else {
              if (blinkCursor) {
                if (blinkDelay) {
                  auxStyle = '-webkit-animation:blink-it steps(1) ' + blinkDelay + ' infinite;-moz-animation:blink-it steps(1) ' + blinkDelay + ' infinite ' +
                        '-ms-animation:blink-it steps(1) ' + blinkDelay + ' infinite;-o-animation:blink-it steps(1) ' + blinkDelay + ' infinite; ' +
                        'animation:blink-it steps(1) ' + blinkDelay + ' infinite;';
                  element.html(text.substring(0, i) + '<span class="blink" style="' + auxStyle + '">' + cursor + '</span>');
                } else {
                  element.html(text.substring(0, i) + '<span class="blink">' + cursor + '</span>');
                }
              } else {
                element.html(text.substring(0, i));
              }
            }
          }

          function getTypeDelay(delay) {
            if (typeof delay === 'string') {
              return delay.charAt(delay.length - 1) === 's' ? parseInt(delay.substring(0, delay.length - 1), 10) * 1000 : +delay;
            }
          }

          function getAnimationDelay(delay) {
            if (typeof delay === 'string') {
              return delay.charAt(delay.length - 1) === 's' ? delay : parseInt(delay.substring(0, delay.length - 1), 10) / 1000;
            }
          }

          scope.$on('$destroy', function() {
            if(timer) {
              $timeout.cancel(timer);
            }
          });
        }

        return {
          restrict: 'A',
          link: linkFunction,
          scope: false
        };
    }]);