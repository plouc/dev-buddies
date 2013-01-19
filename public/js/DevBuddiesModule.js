/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author    Raphaël Benitte
 */
angular
  .module('DevBuddiesModule', [])
  .factory('navigator', [function () {
    'use strict';

    var $panelContainer = $('.panel-container'),
      pages = ['home', 'search', 'buddies', 'buddy', 'settings', 'about'],
      navigator;

    navigator = function (selectedPage, callback) {
      _.each(pages, function (page) {
        if (page !== selectedPage) {
          $panelContainer.removeClass(page);
        } else {
          $panelContainer.addClass(page);
        }
      });
    };

    return navigator;
  }])
  .factory('buddiesFormatter', [function () {
    'use strict';

    return BuddyCollectionFormatter;
  }])
  .factory('app', [function () {
    'use strict';

    var storage = new Storage(),
      app       = new App();

    app.setStorage(storage)
      .getQuotas();

    return app;
  }])
  .directive('block-click', function () {
    return {
      link: function (scope, element, attrs) {
        element.click(function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      }
    }
  })
  .directive('fastClick', function () {
    'use strict';

    var moveTolerance = 10,
      endTolerance = 25,
      coordinates = [],
      preventGhostClick,
      popCoordinates,
      checkClick;

    preventGhostClick = function (x, y) {
      coordinates.push(x, y);
      window.setTimeout(popCoordinates, 2500);
    };

    popCoordinates = function () {
      coordinates = coordinates.splice(0, 2);
    };

    checkClick = function (e) {
      var i, x, y;
      for (i = 0; i < coordinates.length; i += 2) {
        x = coordinates[i];
        y = coordinates[i + 1];
        if (Math.abs(e.clientX - x) < endTolerance && Math.abs(e.clientY - y) < endTolerance) {
          e.stopPropagation();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('click', checkClick, true);

    return {
      priority: 0,
      transclude: false,
      replace: false,
      restrict: 'A',
      link: function link(scope, iElement, attrs) {

        var element = iElement[0],
          startX,
          startY;

        var handleEvent = function (e) {
          switch (e.type) {
            case 'touchstart': onTouchStart(e); break;
            case 'touchmove':  onTouchMove(e);  break;
            case 'touchend':   onClick(e);      break;
            case 'click':      onClick(e);      break;
          }
        };

        var onTouchStart = function (e) {
          e.stopPropagation();

          element.addEventListener('touchend', handleEvent, false);
          document.body.addEventListener('touchmove', handleEvent, false);

          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        };

        var onTouchMove = function (e) {
          if (Math.abs(e.touches[0].clientX - startX) > moveTolerance
           || Math.abs(e.touches[0].clientY - startY) > moveTolerance) {
            reset();
          }
        };

        var onClick = function (e) {
          e.stopPropagation();
          reset();
          scope.$apply(attrs['fastClick']);

          if (e.type === 'touchend') {
            preventGhostClick(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          }
        };

        var reset = function () {
          element.removeEventListener('touchend', handleEvent, false);
          document.body.removeEventListener('touchmove', handleEvent, false);
        };

        element.addEventListener('touchstart', handleEvent, false);
        element.addEventListener('click', handleEvent, false);
      }
    };
  });