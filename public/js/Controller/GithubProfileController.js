function GithubProfileController($scope, app, navigate) {
  'use strict';

  $scope.repositories = [];
  $scope.activities   = [];

  $scope.$on('buddyselect', function (e, buddy) {
    if (buddy.providerData.github) {
      $scope.repositories = buddy.providerData.github.data.repos;
    }
  });
}

GithubProfileController.$inject = ['$scope', 'app', 'navigator'];