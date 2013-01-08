describe('Dev Buddies controllers', function () {

  describe('SettingsController', function () {
    var app, scope, ctrl, storage;

    beforeEach(function () {
      storage = new Storage();
      app     = new App();
      scope   = {};

      app.setStorage(storage);
      ctrl = new SettingsController(scope, app);
    });


    it('should have "2" providers defined, "github" and "stack-overflow"', function () {
      expect(_.keys(scope.providers).length).toBe(2);
      expect(_.keys(scope.providers)).toContain('github');
      expect(_.keys(scope.providers)).toContain('stack-overflow');
    });
  });
});
