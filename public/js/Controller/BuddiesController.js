function BuddiesController($scope, app) {
  'use strict';

  $scope.buddies = app.buddies;
}

BuddiesController.$inject = ['$scope', 'app'];