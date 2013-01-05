/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @param {String} providerName
 * @param {String} fullname
 * @param {String} description
 * @param {object} rawResult
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
     *
     * @return {String}
     */
    toString: function() {
        return this.fullname;
    }
};