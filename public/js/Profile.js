/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author Raphaël Benitte
 * @constructor
 * @param {String} id Profile identifier
 */
var Profile = function (id) {
  'use strict';

  this.id = id;

  this.providerData = {};

  this.avatar = null;
};

/**
 *
 * @param {String} providerName   Name of the provider
 * @param {String} providerUserId User Identifier for the provider
 * @param {Object} data           Informations retrieved by the provider
 */
Profile.prototype.addProviderData = function (providerName, providerUserId, data) {
  'use strict';

  if (data.avatar) {
    this.avatar = data.avatar;
  }

  this.providerData[providerName] = {
    id:   providerUserId,
    data: data
  };
};