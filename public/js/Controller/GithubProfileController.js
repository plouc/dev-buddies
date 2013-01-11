/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author    Raphaël Benitte
 * @constructor
 */
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