/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author Raphaël Benitte
 * @constructor
 * @param {String} id Profile identifier
 */
var Profile = function(id) {
  this.id = id;
  this.providerData = {};
};

/**
 *
 * @param {String} providerName   Name of the provider
 * @param {String} providerUserId User Identifier for the provider
 * @param {Object} data           Informations retrieved by the provider
 */
Profile.prototype.addProviderData = function(providerName, providerUserId, data) {
  this.providerData[providerName] = {
      "id":   providerUserId
    , "data": data
  };
};