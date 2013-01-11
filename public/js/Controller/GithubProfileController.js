function GithubProfileController($scope) {
  'use strict';

  $scope.repositories     = [];
  $scope.showRepositories = false;
  $scope.activities       = [];
  $scope.showActivity     = false;

  $scope.$on('buddyselect', function (e, buddy) {
    if (buddy.providerData.github) {
      $scope.repositories = buddy.providerData.github.data.repos;
    } else {
      $scope.repositories = [];
    }
  });
}

GithubProfileController.$inject = ['$scope'];