describe("Providers", function () {
  "use strict";

  describe("Provider", function () {
    "use strict";

    var provider,
      error;

    beforeEach(function () {
      provider = new Provider();
      error = null;
    });

    it("provider.id should be 'undefined provider id'", function () {
      expect(provider.id).toEqual('undefined provider id');
    });

    it("provider.name should be 'undefined provider name'", function () {
      expect(provider.name).toEqual('undefined provider name');
    });

    it("default search command state should be 'idle'", function () {
      expect(provider.getState('search')).toEqual('idle');
    });

    it("search method should throw an error with message 'You must implement the search method'", function () {
      try {
        provider.search();
      } catch (err) {
        expect(err).toEqual('You must implement the search method');
      }
    });

    it("search method should throw an error with message 'You must implement the getUserProfile method'", function () {
      try {
        provider.getUserProfile();
      } catch (err) {
        error = err;
      }
      expect(error).toEqual('You must implement the getUserProfile method');
    });

    it("formatSearchResult method should throw an error with message 'You must implement the formatSearchResult method'", function () {
      try {
        provider.formatSearchResult({});
      } catch (err) {
        error = err;
      }
      expect(error).toEqual('You must implement the formatSearchResult method');
    });
  });


  describe("Github Provider", function () {
    "use strict";

    var provider;

    beforeEach(function () {
      provider = new GithubProvider();
    });

    it("provider.id should be 'github'", function () {
      expect(provider.id).toEqual('github');
    });

    it("provider.name should be 'github'", function () {
      expect(provider.name).toEqual('github');
    });

    it("default search command state should be 'idle'", function () {
      expect(provider.getState('search')).toEqual('idle');
    });

    it("search method call should change command state to 'loading'", function () {
      spyOn($, 'ajax').andReturn({
        "response": true
      });
      provider.search('term', function () {});
      expect(provider.getState('search')).toEqual('loading');
    });

    it("should convert a raw API response to ProviderResult", function () {
      var formatted = provider.formatSearchResult({});
      expect(formatted).toEqual(jasmine.any(ProviderResult));
    });
  });


  describe("Stack Overlow Provider", function () {
    "use strict";

    var provider;

    beforeEach(function () {
      provider = new StackOverflowProvider();
    });

    it("provider.id should be 'Stack Overflow'", function () {
      expect(provider.id).toEqual('stack-overflow');
    });

    it("provider.name should be 'Stack Overflow'", function () {
      expect(provider.name).toEqual('Stack Overflow');
    });

    it("default search command state should be 'idle'", function () {
      expect(provider.getState('search')).toEqual('idle');
    });

    it("search method call should change command state to 'loading'", function () {
      spyOn($, 'ajax').andReturn({
        "response": true
      });
      provider.search('term', function () {});
      expect(provider.getState('search')).toEqual('loading');
    });

    it("should convert a raw API response to ProviderResult", function () {
      var formatted = provider.formatSearchResult({});
      expect(formatted).toEqual(jasmine.any(ProviderResult));
    });
  });
});