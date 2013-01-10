/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author    Raphaël Benitte
 * @constructor
 */
var App = function () {
  'use strict';

  this.buddies = [];
  this.buddy   = {};

  // define available providers
  var githubProvider      = new GithubProvider(),
    stackOverflowProvider = new StackOverflowProvider();

  this.providers = {};
  this.providers[githubProvider.id]        = githubProvider;
  this.providers[stackOverflowProvider.id] = stackOverflowProvider;

  this.storage = null;
};

App.prototype.getQuotas = function () {
  'use strict';

  var self = this;

  this.storage.getAll('quota', function (quotas) {
    _.each(quotas, function (quota, providerId) {
      self.providers[providerId].quota = {
        max:       quota.max,
        remaining: quota.remaining
      };
    });
  });

  return this;
};

/**
 *
 * @param {Storage} storage STorage used to store user profiles and settings
 * @return {App}
 */
App.prototype.setStorage = function (storage) {
  'use strict';

  this.storage = storage;

  return this;
};

/**
 * @param {Function} callback
 */
App.prototype.getBuddies = function (callback) {
  'use strict';

  var self = this;

  this.storage.getAll('buddies', function (buddies) {
    self.buddies = buddies;
    if (_.isFunction(callback)) {
      callback(buddies);
    }
  });
};

/**
 * @param {Profile} profile
 * @param {Function}
 */
App.prototype.storeProfile = function (profile, callback) {
  'use strict';

  this.storage.set('buddies', profile.id, profile, function () {
    if (_.isFunction(callback)) {
      callback(profile);
    }
  });
};

/**
 * @param {Profile}  profile
 * @param {Function} callback
 */
App.prototype.removeProfile = function (profile, callback) {
  'use strict';

  this.storage.remove('buddies', profile.id, function () {
    if (_.isFunction(callback)) {
      callback();
    }
  });
};

/**
 * Returns a provider by its id.
 *
 * @param {String} providerId
 * @return {Provider}
 */
App.prototype.getProvider = function (providerId) {
  'use strict';

  if (!this.providers.hasOwnProperty(providerId)) {
    throw 'Invalid provider requested, there is no provider defined for id "' + providerId + '"';
  }
  return this.providers[providerId];
};

/**
 *
 * @return {Array} Returns all provider ids
 */
App.prototype.getProviderIds = function () {
  'use strict';

  return _.keys(this.providers);
};


/**
 *
 * @param {String}   query    Term to search on various APIs
 * @param {Function} callback Function to call when complete
 */
App.prototype.search = function (query, callback) {
  'use strict';

  var providersCount = _.keys(this.providers).length,
    responseCount    = 0,
    results          = [];

  _.each(this.providers, function (provider) {
    provider.search(query, function (result) {
      responseCount++;
      result.provider = provider.id;
      results = results.concat(result);
      if (responseCount === providersCount) {
        results.sort();
        if (_.isFunction(callback)) {
          callback(results);
        }
      }
    });
  });
};

/**
 * Collect user info on all selected APIs.
 *
 * @param {String}   profileId     The profile identifier
 * @param {Object}   searchResults An object of ProviderResult
 * @param {Function} callback      Function to call when profile fetched
 */
App.prototype.getUserProfile = function (profileId, searchResults, callback) {
  'use strict';

  var self            = this,
    selectedProviders = {},
    responseCount     = 0,
    profile           = new Profile(profileId),
    providersCount;

  _.each(searchResults, function (result) {
    selectedProviders[result.providerName] = self.getProvider(result.providerName);
  });

  providersCount = _.keys(selectedProviders).length;

  console.log("Selected user profile providers to build profile: ", Object.keys(selectedProviders).join(', '));

  _.each(searchResults, function (result) {
    var provider = self.getProvider(result.providerName);
    provider.getUserProfile(result, function (userProfile) {
      responseCount++;
      profile.addProviderData(provider.id, result.userId, userProfile);
      if (responseCount === providersCount) {
        self.storeProfile(profile, function (profile) {
          if (_.isFunction(callback)) {
            callback(profile);
          }
        });
      }
    });
  });
};