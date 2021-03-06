/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author    Raphaël Benitte
 * @constructor
 */
function AppController($scope, app, navigate) {
  'use strict';

  $scope.message     = '';
  $scope.messageType = '';
  $scope.setMessage = function (type, message) {
    $scope.messageType = type;
    $scope.message     = message;
  };
  $scope.emptyMessage = function () {
    $scope.messageType = '';
    $scope.message     = '';
  };

  $scope.loading = false;
  $scope.setLoading = function (flag) {
    $scope.loading = flag;
  };

  $scope.goto = function (page) {
    navigate(page);
  };

  $scope.$on('buddies.refresh', function (e, buddies) {
    console.log(buddies);
  });

  $scope.safeApply = function (fn) {
    var phase = this.$root.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn && (typeof (fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };
}

AppController.$inject = ['$scope', 'app', 'navigator'];