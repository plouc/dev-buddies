/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author    Raphaël Benitte
 * @constructor
 */
var App = function() {

  // define available providers
  var githubProvider        = new GithubProvider();
  var stackOverflowProvider = new StackOverflowProvider();

  this.providers = {};
  this.providers[githubProvider.name]        = githubProvider;
  this.providers[stackOverflowProvider.name] = stackOverflowProvider;

  this.providerRenderers = {};
  this.providerRenderers[githubProvider.name] = new GithubRenderer();
  this.providerRenderers[githubProvider.name].init();
  this.providerRenderers[stackOverflowProvider.name] = new StackOverflowRenderer();
  this.providerRenderers[stackOverflowProvider.name].init();

  this.storage = null;
};

/**
 *
 * @param {Storage} storage STorage used to store user profiles and settings
 */
App.prototype.setStorage = function(storage) {
  this.storage = storage;
};

/**
 * @param {String} profileName
 */
App.prototype.storeProfileResult = function(profileName, result) {
  console.log(result);
};

/**
 * Returns a provider by its name.
 *
 * @param {String} providerId
 * @return {Provider}
 */
App.prototype.getProvider = function(providerName) {
  if (!this.providers.hasOwnProperty(providerName)) {
    throw 'Invalid provider requested, there is no provider defined for id "' + providerName + '"';
  }
  return this.providers[providerName];
};

/**
 *
 * @return {Array}
 */
App.prototype.getProviderNames = function() {
  return Object.keys(this.providers);
};

/**
 *
 * @param {Array} providers
 * @param {String} command
 * @param {String} state
 * @param {Function} callback
 * @return {Boolean}
 */
App.prototype.checkProvidersState = function(providers, command, state, callback) {

  var provider;

  for (var providerId in providers) {
    provider = providers[providerId];
    if (provider.states[command] !== state) {
      return false;
    }
  }

  callback();
};

/**
 *
 * @param {Array} providers
 * @param {String} command
 * @return {Array}
 */
App.prototype.getProvidersResult = function(providers, command) {

  var results = []
    , provider
    , response;

  for (var providerId in providers) {
    provider = providers[providerId];
    response = provider.responses[command];
    response.forEach(function(result) {
      result.provider = providerId;
      results.push(result);
    });
  }

  results.sort();

  return results;
};

/**
 *
 * @param {String} query
 * @param {Function} callback
 */
App.prototype.search = function(query, callback) {

  var self = this
    , provider;

  for (var providerId in this.providers) {
    provider = this.providers[providerId];
    provider.search(query, function() {
      self.checkProvidersState(self.providers, 'search', 'loaded', function() {
        callback(query, self.getProvidersResult(self.providers, 'search'));
      });
    });
  }
};

/**
 * @param {String} providerName
 * @param {Provider}
 */
App.prototype.getProviderRenderer = function(providerName) {
  return this.providerRenderers[providerName];
};

/**
 *
 * @param {Object} searchResults
 * @param {Function} callback
 */
App.prototype.getUserProfile = function(searchResults, callback) {

  var self = this
    , result
    , selectedProviders = {}
    , responses = {}
    , provider;

  for (var resultId in searchResults) {
    result = searchResults[resultId];
    selectedProviders[result.providerName] = this.getProvider(result.providerName);
  }

  console.log('Selected user profile providers: ', Object.keys(selectedProviders));

  for (resultId in searchResults) {
    result = searchResults[resultId];
    provider = this.getProvider(result.providerName);
    provider.getUserProfile(result, function(userProfile) {
      responses[this.name] = userProfile;
      self.checkProvidersState(selectedProviders, 'getUserProfile', 'loaded', function() {
        callback(responses);
      });
    });
  }
};