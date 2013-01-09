function AppController($scope, app, navigate) {
  'use strict';

  $scope.goto = function (page) {
    navigate(page);
  };
}

AppController.$inject = ['$scope', 'app', 'navigator'];