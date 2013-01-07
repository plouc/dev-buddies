angular
  .module('DevBuddiesModule', [])
  .factory('app', [function () {
    'use strict';

    var storage = new Storage(),
      app       = new App();

    app.setStorage(storage)
      .getQuotas()
      .getBuddies();

    return app;
  }]);