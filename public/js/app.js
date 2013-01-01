/**
 * (c) 2012-2013 Raphaël Benitte
 *
 * @constructor
 */
var App = function() {

    // define available providers
    var linkedInProvider      = new LinkedInProvider();
    var githubProvider        = new GithubProvider();
    var stackOverflowProvider = new StackOverflowProvider();
    var twitterProvider       = new TwitterProvider();

    this.providers = {};
    this.providers[linkedInProvider.name]      = linkedInProvider;
    this.providers[githubProvider.name]        = githubProvider;
    this.providers[stackOverflowProvider.name] = stackOverflowProvider;
    //this.providers[twitterProvider.name]       = twitterProvider;
};

App.prototype = {
    /**
     *
     * @param providerId
     * @return {*}
     */
    getProvider: function(providerId) {
        if (!this.providers.hasOwnProperty(providerId)) {
            throw 'Invalid provider requested, there is no provider defined for id "' + providerId + '"';
        }
        return this.providers[providerId];
    },

    /**
     *
     * @param command
     * @param state
     * @param callback
     * @return {Boolean}
     */
    checkProvidersState: function(command, state, callback) {
        var provider;
        for (var providerId in this.providers) {
            provider = this.providers[providerId];
            if (provider.states[command] !== state) {
                return false;
            }
        }

        callback();
    },

    /**
     *
     * @param command
     * @return {Array}
     */
    getProvidersResult: function(command) {

        var results = [],
            provider,
            response;

        for (var providerId in this.providers) {
            provider = this.providers[providerId];
            response = provider.responses[command];
            response.forEach(function(result) {
                result.provider = providerId;
                results.push(result);
            });
        }

        results.sort();

        return results;
    },

    /**
     *
     * @param query
     * @param callback
     */
    search: function(query, callback) {

        var self = this,
            provider;

        for (var providerId in this.providers) {
            provider = this.providers[providerId];
            provider.search(query, function() {
                self.checkProvidersState('search', 'loaded', function() {
                    callback(self.getProvidersResult('search'));
                });
            });
        }
    }
};