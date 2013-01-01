/**
 * (c) 2012-2013 Raphaël Benitte
 *
 * @param providerName
 * @param fullname
 * @param description
 * @param rawResult
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
     * @return {*}
     */
    toString: function() {
        return this.fullname;
    }
};