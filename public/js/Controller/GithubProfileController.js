function GithubProfileController($scope) {
  'use strict';

  $scope.repositories     = [];
  $scope.showRepositories = true;
  $scope.activities       = [];

  $scope.$on('buddyselect', function (e, buddy) {
    if (buddy.providerData.github) {
      $scope.repositories = buddy.providerData.github.data.repos;
    } else {
      $scope.repositories = [];
    }
  });
}

GithubProfileController.$inject = ['$scope'];