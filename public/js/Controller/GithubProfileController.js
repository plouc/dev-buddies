/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author    Raphaël Benitte
 * @constructor
 */
function GithubProfileController($scope) {
  'use strict';

  $scope.repositories     = [];
  $scope.showRepositories = false;
  $scope.events           = [];
  $scope.showActivity     = false;

  $scope.$on('buddyselect', function (e, buddy) {
    $scope.repositories = buddy.providerData.github ? buddy.providerData.github.data.repos  : [];
    $scope.events       = buddy.providerData.github ? buddy.providerData.github.data.events : [];
  });
}

GithubProfileController.$inject = ['$scope'];