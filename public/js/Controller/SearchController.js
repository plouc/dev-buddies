function SearchController($scope, app, navigate) {
  'use strict';

  $scope.query        = '';
  $scope.results      = [];
  $scope.hasSelection = false;
  $scope.state        = 'idle';

  $scope.clear = function () {
    $scope.query = '';
  };

  $scope.search = function () {
    $scope.state = 'searching';
    $scope.selectedResults = [];
    app.search(this.query, function (results) {
      $scope.state   = 'loaded';
      $scope.results = results;
      $scope.$parent.safeApply();
    });
  };

  $scope.selectResult = function (result) {
    result.selected = !result.selected;
    _.each($scope.results, function (result) {
      if (result.selected) {
        $scope.hasSelection = true;
        return;
      }
    });
  };

  $scope.build = function () {
    $scope.state = 'loading';
    var selectedResults = [];
    _.each($scope.results, function (result) {
      if (result.selected) {
        selectedResults.push(result);
      }
    });
    app.getUserProfile($scope.query, selectedResults, function (profile) {
      $scope.state = 'loaded';
      app.getBuddies(function (buddies) {
        $scope.$parent.$broadcast('buddies.refresh', buddies);
      });
      $scope.$parent.$broadcast('buddyselect', profile);
      navigate('buddy-profile');
      $scope.$parent.safeApply();
    });
  };
}

SearchController.$inject = ['$scope', 'app', 'navigator'];