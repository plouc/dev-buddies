/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author    Raphaël Benitte
 * @constructor
 */
var App = function () {
  "use strict";

  // define available providers
  var githubProvider      = new GithubProvider(),
    stackOverflowProvider = new StackOverflowProvider();

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
App.prototype.setStorage = function (storage) {
  "use strict";

  console.log('Setting app storage', storage);
  this.storage = storage;
};

/**
 * @param {Profile} profile
 */
App.prototype.storeProfile = function (profile) {
  "use strict";

  console.log('Store profile', profile, 'with id', profile.id);

  this.storage.set('buddies', profile.id, profile, function () {
    console.log('Profile stored');
  });
};

/**
 * @param {Profile}  profile
 * @param {Function} callback
 */
App.prototype.removeProfile = function (profile, callback) {
  "use strict";

  console.log('Removing profile', profile);

  this.storage.remove('buddies', profile.id, function () {
    console.log('Profile ' + profile.id + ' removed');
    callback();
  });
};

/**
 * Returns a provider by its name.
 *
 * @param {String} providerId
 * @return {Provider}
 */
App.prototype.getProvider = function (providerName) {
  "use strict";

  if (!this.providers.hasOwnProperty(providerName)) {
    throw 'Invalid provider requested, there is no provider defined for id "' + providerName + '"';
  }
  return this.providers[providerName];
};

/**
 *
 * @return {Array} Returns all provider names
 */
App.prototype.getProviderNames = function () {
  "use strict";

  return _.keys(this.providers);
};

/**
 *
 * @param {Array} providers
 * @param {String} command
 * @param {String} state
 * @param {Function} callback
 * @return {Boolean}
 */
App.prototype.checkProvidersState = function (providers, command, state, callback) {
  "use strict";

  _.each(providers, function (provider) {
    if (provider.states[command] !== state) {
      return false;
    }
  });

  callback();
};

/**
 *
 * @param {Array} providers
 * @param {String} command
 * @return {Array}
 */
App.prototype.getProvidersResult = function (providers, command) {
  "use strict";

  var results = [],
    response;

  _.each(providers, function (provider) {
    response = provider.responses[command];
    if (response !== null) {
      response.forEach(function (result) {
        result.provider = provider.name;
        results.push(result);
      });
    }
  });

  results.sort();

  return results;
};

/**
 *
 * @param {String}   query    Term to search on various APIs
 * @param {Function} callback Function to call when complete
 */
App.prototype.search = function (query, callback) {
  "use strict";

  var self = this;

  _.each(this.providers, function (provider) {
    provider.search(query, function () {
      self.checkProvidersState(self.providers, 'search', 'loaded', function() {
        var results = self.getProvidersResult(self.providers, 'search');
        if (_.isFunction(callback)) {
          callback(query, results);
        }
      });
    });
  });
};

/**
 * @param {String} providerName
 * @param {Provider}
 */
App.prototype.getProviderRenderer = function (providerName) {
  "use strict";

  return this.providerRenderers[providerName];
};

/**
 * Collect user info on all selected APIs.
 *
 * @param {String}   profileId     The profile identifier
 * @param {Object}   searchResults An object of ProviderResult
 * @param {Function} callback      Function to call when profile fetched
 */
App.prototype.getUserProfile = function (profileId, searchResults, callback) {
  "use strict";

  var self = this,
    result,
    selectedProviders = {},
    provider,
    profile = new Profile(profileId);

  _.each(searchResults, function (result) {
    selectedProviders[result.providerName] = self.getProvider(result.providerName);
  });

  console.log('Selected user profile providers to build profile: ', Object.keys(selectedProviders).join(', '));

  _.each(searchResults, function (result) {
    provider = self.getProvider(result.providerName);

    provider.getUserProfile(result, function (oResult, userProfile) {
      profile.addProviderData(this.name, oResult.userId, userProfile);

      self.checkProvidersState(selectedProviders, 'getUserProfile', 'loaded', function () {
        if (_.isFunction(callback)) {
          callback(profile);
        }
      });
    });
  });
};