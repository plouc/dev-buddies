/**
 * Stack Overflow specific provider.
 *
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @augments Provider
 * @constructor
 */
var StackOverflowProvider = function () {
  'use strict';

  Provider.call(this);

  this.id      = 'stack-overflow';
  this.name    = 'Stack Overflow';
  this.enabled = true;
  this.quota   = {
    max:       'n/a',
    remaining: 'n/a'
  };

  this.baseUrls = {
    userSearch: 'https://api.stackexchange.com/2.1/users' //?order=desc&sort=reputation&inname=mlarcher&site=stackoverflow
  };
};

// extend base provider
StackOverflowProvider.prototype = Object.create(new Provider(), {});

/**
 *
 * @param query
 * @param callback
 */
StackOverflowProvider.prototype.search = function (query, callback) {
  "use strict";

  // reset search state and response
  this.setState('search', 'loading')
      .setResponse('search', null);

  var self = this;

  $.ajax({
    url: this.baseUrls.userSearch,
    dataType: 'json',
    data: {
      'order':  'asc',
      'sort':   'name',
      'site':   'stackoverflow',
      'inname': query
    },
    success: function (response) {
      console.log('StackOverflowProvider response:');
      console.log(response);

      self.quota.max       = response.quota_max;
      self.quota.remaining = response.quota_remaining;

      self.setState('search', 'loaded')
          .setResponse('search', self.formatSearchResults(response.items));

      callback();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('StackOverflowProvider error: ' + errorThrown);

      self.setState('search', 'loaded')
          .setResponse('search', []);

      callback();
    }
  });
};

/**
 *
 * @param result
 * @param callback
 */
StackOverflowProvider.prototype.getUserProfile = function(result, callback) {

  var response = {};

  console.log('StackOverflowProvider.getUserProfile() response:');
  console.log(response);

  this.setState('getUserProfile', 'loaded')
      .setResponse('getUserProfile', response);

  callback.call(this, result, response);
};

/**
 * Format a result to conform App requirements,
 * typical github result fields:
 *   account_id:                433288
 *   badge_counts:              Object
 *   creation_date:             1309238312
 *   display_name:              "ᴺᴱᴼᴺ"
 *   is_employee:               false
 *   last_access_date:          1356421858
 *   last_modified_date:        1347362334
 *   link:                      "http://stackoverflow.com/users/818544/"
 *   location:                  "Thai"
 *   profile_image:             "http://www.gravatar.com/avatar/894891fa86576454f1cab28c28625425?d=identicon&r=PG"
 *   reputation:                13
 *   reputation_change_day:     0
 *   reputation_change_month:   0
 *   reputation_change_quarter: 0
 *   reputation_change_week:    0
 *   reputation_change_year:    12
 *   user_id:                   818544
 *   user_type:                 "registered"
 *   website_url:               ""
 *
 * @param result
 * @return {Object}
 */
StackOverflowProvider.prototype.formatSearchResult = function(result) {
  "use strict";

  return new ProviderResult(this.id, result.user_id, result.display_name, '', result.profile_image, result);
};