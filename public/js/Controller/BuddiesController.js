/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author    Raphaël Benitte
 * @constructor
 */
function BuddiesController($scope, app, navigate, buddiesFormatter) {
  'use strict';

  var editing = false;

  $scope.editing = '';
  $scope.letters = {};

  $scope.switchEditMode = function () {
    editing = !editing;
    if (editing) {
      $scope.editing = 'editing';
    } else {
      $scope.editing = '';
    }
  };

  $scope.removeBuddy = function (buddy) {
    if (buddy.pendingRemove) {
      app.removeProfile(buddy);
      app.getBuddies(function (buddies) {
        $scope.$parent.$broadcast('buddies.refresh', buddies);
        $scope.letters = buddiesFormatter.format(buddies);
      });
    } else {
      buddy.pendingRemove = true;
    }
  };

  $scope.selectBuddy = function (buddy) {
    $scope.$parent.$broadcast('buddyselect', buddy);
    navigate('buddy');
  };

  app.getBuddies(function (buddies) {
    $scope.$parent.$broadcast('buddies.refresh', buddies);
    $scope.letters = buddiesFormatter.format(buddies);
  });

  $scope.$on('buddies.refresh', function (e, buddies) {
    $scope.letters = buddiesFormatter.format(buddies);
  });
}

BuddiesController.$inject = ['$scope', 'app', 'navigator', 'buddiesFormatter'];