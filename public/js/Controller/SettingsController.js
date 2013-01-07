function SettingsController($scope, app) {
  'use strict';

  $scope.providers = app.providers;

  $scope.getEnabledStatus = function (provider) {
    return provider.enabled ? 'on' : 'off';
  };
}

SettingsController.$inject = ['$scope', 'app'];