/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author    Raphaël Benitte
 * @constructor
 */
function BuddyController($scope, $rootScope, app, navigate) {
  'use strict';

  $scope.buddy = {};

  $scope.$on('buddyselect', function (e, buddy) {
    $scope.buddy = buddy;
  });
}

BuddyController.$inject = ['$scope', '$rootScope', 'app', 'navigator'];