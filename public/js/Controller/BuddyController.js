function BuddyController($scope, app, navigate) {
  'use strict';

  $scope.buddy = {};

  $scope.$on('buddyselect', function (e, buddy) {
    $scope.buddy = buddy;
  });
}

BuddyController.$inject = ['$scope', 'app', 'navigator'];