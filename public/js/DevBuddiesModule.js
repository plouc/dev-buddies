angular
  .module('DevBuddiesModule', [])
  .factory('navigator', [function () {
    'use strict';

    var $panelContainer = $('.panel-container');
    var navigator = function (page, callback) {

      var $panel  = $('#' + page),
        $subpanel = null,
        $subpanelContainer;

      if ($panel.hasClass('subpanel')) {
        $subpanel = $panel;
        $panel    = $subpanel.parents('.panel');
      }

      $panelContainer.animate({
        'left': '-' + ($panel.index() * 20) + '%'
      }, 400, function () {
        if ($subpanel === null && callback) {
          callback();
        }
      });

      if ($subpanel !== null) {
        $subpanelContainer = $panel.find('.subpanel-container');

        setTimeout(function () {
          $subpanelContainer.animate({
            'top': '-' + ($subpanel.index() * 100) + '%'
          }, 400, function () {
            if (callback) {
              callback();
            }
          });
        }, 400);
      }
    };

    return navigator;
  }])
  .factory('app', [function () {
    'use strict';

    var storage = new Storage(),
      app       = new App();

    app.setStorage(storage)
      .getQuotas()
      .getBuddies();

    return app;
  }]);