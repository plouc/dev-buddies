/**
 * Twitter specific provider.
 *
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @augments Provider
 * @constructor
 */
var TwitterProvider = function () {
  "use strict";

  Provider.call(this);

  this.id   = 'twitter';
  this.name = 'twitter';

  this.baseUrls = {
    userSearch: 'https://api.twitter.com/1.1/users/search.json'
  };
};

// extend base provider
TwitterProvider.prototype = Object.create(new Provider(), {});

/**
 *
 * @param query
 * @param callback
 * @example
 * var twitterProvider = new TwitterProvider();
 * twitterProvider.search('Douglas Crockford', function(result) {
 *   console.log(result);
 * });
 */
TwitterProvider.prototype.search = function (query, callback) {
  "use strict";

  // reset search state and response
  this.setState('search', 'loading')
      .setResponse('search', null);

  var self = this;

  try {
    $.ajax({
      url: this.baseUrls.userSearch,
      data: {
        'q': query
      },
      dataType: 'jsonp',
      success: function (response) {
        console.log('TwitterProvider response:');
        console.log(response);

        self.setState('search', 'loaded')
            .setResponse('search', self.formatSearchResults(response.users));

        callback(response.users);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('TwitterProvider error: ' + errorThrown);

        self.setState('search', 'loaded')
            .setResponse('search', []);

        callback({});
      }
    });
  } catch (error) {
      console.log(Error, error);
  }
};

/**
 * Format a result to conform App requirements,
 * typical github result fields:
 *
 * @param {Object} result
 * @return {ProviderResult}
 */
TwitterProvider.prototype.formatSearchResult = function (result) {
  "use strict";

  var fullname  = result.login,
    description = '';

  if (result.fullname !== null && result.fullname !== '') {
    fullname += ' [' + result.fullname + ']';
  }

  if (result.language !== null) {
    description = result.language + ' developper';
  }

  return new ProviderResult(this.id, fullname, description, null, result);
};