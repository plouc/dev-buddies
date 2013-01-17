/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author    Raphaël Benitte
 * @constructor
 */
function SearchController($scope, app, navigate) {
  'use strict';

  $scope.query        = '';
  $scope.results      = [];
  $scope.hasSelection = false;

  $scope.clear = function () {
    $scope.query = '';
  };

  $scope.search = function () {
    if ($scope.query.length < 3) {
      $scope.setMessage('error', 'You must type at least 3 characters in order to perform the search');
    } else {
      $scope.setLoading(true);
      $scope.selectedResults = [];
      app.search(this.query, function (results) {
        $scope.setLoading(false);
        $scope.results = results;
        $scope.$parent.safeApply();
      });
    }
  };

  $scope.selectResult = function (result) {
    result.selected = !result.selected;
    _.each($scope.results, function (oresult) {
      if (oresult.selected) {
        $scope.hasSelection = true;
      }
      if (oresult.providerId === result.providerId) {
        if (result.selected && oresult !== result) {
          oresult.enabled = false;
        } else if (!result.selected) {
          oresult.enabled = true;
        }
      }
    });
  };

  $scope.build = function () {
    $scope.setLoading(true);
    var selectedResults = [];
    _.each($scope.results, function (result) {
      if (result.selected) {
        selectedResults.push(result);
      }
    });
    app.getUserProfile($scope.query, selectedResults, function (profile) {
      $scope.setLoading(false);
      app.getBuddies(function (buddies) {
        $scope.setLoading(false);
        $scope.$parent.$broadcast('buddies.refresh', buddies);
      });
      $scope.$parent.$broadcast('buddyselect', profile);
      navigate('buddy-profile');
      $scope.$parent.safeApply();
    });
  };
}

SearchController.$inject = ['$scope', 'app', 'navigator'];