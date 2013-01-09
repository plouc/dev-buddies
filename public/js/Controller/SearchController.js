function SearchController($scope, app, navigate) {
  'use strict';

  $scope.query           = '';
  $scope.results         = [];
  $scope.selectedResults = [];
  $scope.state           = 'idle';

  $scope.clear = function () {
    $scope.query = '';
  };

  $scope.test = function () {
    console.log('working');
  };

  $scope.search = function () {
    $scope.state = 'searching';
    $scope.selectedResults = [];
    app.search(this.query, function (query, results) {
      $scope.state = 'loaded';
      $scope.results = _.values(results);
      $scope.$apply();
    });
  };

  $scope.selectResult = function (result) {
    result.selected = true;
    $scope.selectedResults.push(result);
  };

  $scope.build = function () {
    $scope.state = 'loading';
    app.getUserProfile($scope.query, $scope.selectedResults, function (profile) {
      $scope.state = 'loaded';
      $scope.$parent.$broadcast('buddyselect', profile);
      navigate('buddy-profile');
    });
  };
}

SearchController.$inject = ['$scope', 'app', 'navigator'];