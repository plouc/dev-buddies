/**
 * Base class for providers.
 *
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @constructor
 */
var Provider = function () {
  'use strict';

  this.id   = 'undefined provider id';
  this.name = 'undefined provider name';
};

Provider.prototype.search = function () {
  'use strict';
  throw 'You must implement the search method';
};

Provider.prototype.getUserProfile = function (result) {
  'use strict';
  throw 'You must implement the getUserProfile method';
};

Provider.prototype.formatSearchResult = function () {
  'use strict';
  throw 'You must implement the formatSearchResult method';
};

/**
 *
 * @param {Array} results
 */
Provider.prototype.formatSearchResults = function (results) {
  'use strict';

  var self = this;

  return results.map(function (result) {
    return self.formatSearchResult(result);
  });
};