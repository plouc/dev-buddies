function BuddyController($scope, $rootScope, app, navigate) {
  'use strict';

  $scope.buddy = {};

  $scope.$on('buddyselect', function (e, buddy) {
    $scope.buddy = buddy;
  });
}

BuddyController.$inject = ['$scope', '$rootScope', 'app', 'navigator'];