/**
 * Github specific provider.
 *
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @augments Provider
 * @constructor
 */
var GithubProvider = function () {
  'use strict';

  Provider.call(this);

  this.id      = 'github';
  this.name    = 'github';
  this.enabled = true;
  this.quota   = {
    max:       'n/a',
    remaining: 'n/a'
  };

  this.baseUrls = {
    userSearch:  "https://api.github.com/legacy/user/search/:query",
    userProfile: "https://api.github.com/users/:user",
    userEvents:  "https://api.github.com/users/:user/events/public",
    userRepos:   "https://api.github.com/users/:user/repos"
  };
};

// extend base provider
GithubProvider.prototype = Object.create(new Provider(), {});

/**
 *
 * @param {String} query
 * @param {Function} callback
 */
GithubProvider.prototype.search = function (query, callback) {
  'use strict';

  var self = this;

  $.ajax({
    url: this.baseUrls.userSearch.replace(':query', query),
    dataType: 'jsonp',
    success: function (response) {
      console.log('GithubProvider response:');
      console.log(response);

      if (response.meta) {
        if (response.meta.status && response.meta.status === 403) {
          callback({});
          console.log('Github rate limit exceeded');
          return;
        }
        self.quota.max       = response.meta['X-RateLimit-Limit'];
        self.quota.remaining = response.meta['X-RateLimit-Remaining'];
      }

      callback(self.formatSearchResults(response.data.users));
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('GithubProvider error: ' + errorThrown);

      callback({});
    }
  });
};

/**
 * Retrieve informations about an user from a search result.
 *
 * @param {Object} result
 * @param {Function} callback
 */
GithubProvider.prototype.getUserProfile = function (result, callback) {
  'use strict';

  var self            = this,
    responseCount     = 0,
    compositeResponse = {};

  var onResponse = function () {
    if (responseCount === 3) {
      console.log('GithubProvider.getUserProfile() response:');
      console.log(compositeResponse);

      if (_.isFunction(callback)) {
        callback(compositeResponse);
      }
    }
  };

  $.ajax({
    url: this.baseUrls.userEvents.replace(':user', result.userId),
    dataType: "jsonp",
    success: function (response) {
      if (response.meta) {
        self.quota.max       = response.meta['X-RateLimit-Limit'];
        self.quota.remaining = response.meta['X-RateLimit-Remaining'];
      }
      compositeResponse.events = response.data;
      responseCount++;
      onResponse();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      compositeResponse.events = null;
      responseCount++;
      onResponse();
    }
  });

  $.ajax({
    url: this.baseUrls.userRepos.replace(':user', result.raw.login),
    dataType: "jsonp",
    success: function (response) {
      if (response.meta) {
        self.quota.max       = response.meta['X-RateLimit-Limit'];
        self.quota.remaining = response.meta['X-RateLimit-Remaining'];
      }
      compositeResponse.repos = response.data;
      responseCount++;
      onResponse();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      compositeResponse.repos = null;
      responseCount++;
      onResponse();
    }
  });

  $.ajax({
    "url": this.baseUrls.userProfile.replace(':user', result.raw.login),
    "dataType": "jsonp",
    "success": function (response) {
      if (response.meta) {
        self.quota.max       = response.meta['X-RateLimit-Limit'];
        self.quota.remaining = response.meta['X-RateLimit-Remaining'];
      }
      compositeResponse.profile = response.data;
      responseCount++;
      onResponse();
    },
    "error": function (jqXHR, textStatus, errorThrown) {
      compositeResponse.profile = null;
      responseCount++;
      onResponse();
    }
  });
};

/**
 * Format a result to conform App requirements,
 * typical github result fields:
 *   created:            "2008-12-12T16:41:45-08:00"
 *   created_at:        "2008-12-12T16:41:45-08:00"
 *   followers:         1
 *   followers_count:   1
 *   fullname:          null
 *   id:                "user-"
 *   language:          null
 *   location:          null
 *   login:             "undefined"
 *   name:              null
 *   public_repo_count: 0
 *   repos:             0
 *   type:              "user"
 *   username:          "undefined"
 *
 * @param {Object} result
 * @return {ProviderResult}
 */
GithubProvider.prototype.formatSearchResult = function (result) {
  'use strict';

  var fullname = result.login;
  if (result.fullname !== null && result.fullname !== '') {
    fullname += ' [' + result.fullname + ']';
  }

  var description = '';
  if (result.language !== null) {
    description = result.language + ' developper';
  }

  return new ProviderResult(this.id, result.login, fullname, description, null, result);
};