/**
 * (c) 2012-2013 Raphaël Benitte
 *
 * @param providerName
 * @param fullname
 * @param description
 * @param extra
 * @constructor
 */
var ProviderResult = function(providerName, fullname, description, extra) {

    this.providerName = providerName;

    // common properties
    this.fullname    = fullname;
    this.description = description;

    // placeholder for provider specific fields
    this.extra = extra;
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