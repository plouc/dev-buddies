/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @param {String} providerId  Name of the provider
 * @param {String} userId      Provider user identifier
 * @param {String} fullname    Fullname of the user
 * @param {String} description Description of the user
 * @param {object} rawResult   Raw provider API response
 * @constructor
 */
var ProviderResult = function (providerId, userId, fullname, description, picture, rawResult) {
  'use strict';

  this.providerId = providerId;

  this.userId = userId;

  this.enabled  = true;
  this.selected = false;

  // common properties
  this.fullname    = fullname;
  this.description = description;
  this.picture     = picture;

  // raw result
  this.raw = rawResult;
};

/**
 * @return {String}
 */
ProviderResult.prototype.toString = function () {
  'use strict';

  return this.fullname;
};