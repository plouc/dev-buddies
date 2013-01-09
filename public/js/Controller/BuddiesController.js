function BuddiesController($scope, app, navigate) {
  'use strict';

  var editing = false;

  $scope.editing = '';
  $scope.buddies = app.buddies;

  $scope.switchEditMode = function (e) {
    e.preventDefault();
    editing = !editing;
    if (editing) {
      $scope.editing   = 'editing';
    } else {
      $scope.editing   = '';
    }
  };

  $scope.selectBuddy = function (buddy) {
    $scope.$parent.$broadcast('buddyselect', buddy);
    navigate('buddy-profile');
  };
}

BuddiesController.$inject = ['$scope', 'app', 'navigator'];