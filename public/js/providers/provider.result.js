/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @param {String} providerName  Name of the provider
 * @param {String} fullname      Fullname of the user
 * @param {String} description   Description of the user
 * @param {object} rawResult     Raw provider API response
 * @constructor
 */
var ProviderResult = function(providerName, fullname, description, picture, rawResult) {

    this.providerName = providerName;

    // common properties
    this.fullname    = fullname;
    this.description = description;
    this.picture     = picture;

    // raw result
    this.raw = rawResult;
};

ProviderResult.prototype = {
    /**
     * @return {String}
     */
    toString: function() {
        return this.fullname;
    }
};