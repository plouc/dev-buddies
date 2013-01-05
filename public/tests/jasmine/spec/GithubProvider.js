describe("Github Provider", function() {

    var provider;

    beforeEach(function() {
        provider = new GithubProvider();
    });

    it("provider name should be 'github'", function() {
        expect(provider.name).toEqual('github');
    });

    it("default search command state should be 'idle'", function() {
        expect(provider.getState('search')).toEqual('idle');
    });

    it("search method call should change command state to 'loading'", function() {
        spyOn($, 'ajax').andReturn({
            "response": true
        });
        provider.search('term', function() {});
        expect(provider.getState('search')).toEqual('loading');
    });

    it("should convert a raw API response to ProviderResult", function() {
        var formatted = provider.formatResult({});
        expect(formatted).toEqual(jasmine.any(ProviderResult));
    });
});