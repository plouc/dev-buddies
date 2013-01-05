/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author Raphaël Benitte
 * @constructor
 */
var Profile = function() {

  this.providerInfos = {

  };
};

/**
 *
 * @param {String} providerName Name of the provider
 * @param {Object} infos        Informations retrieved by the provider
 */
Profile.prototype.addProviderInfos = function(providerName, infos) {
  this.providerInfos[providerName] = infos;
};