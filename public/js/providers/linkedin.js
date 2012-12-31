/**
 * (c) 2012-2013 Raphaël Benitte
 *
 * LinkedIn specific provider.
 *
 * @constructor
 */
var LinkedInProvider = function() {

    Provider.call(this);

    this.id = 'linkedin';

    this.loaded        = false;
    this.authenticated = false;

    this.profileFields = ['firstName', 'lastName', 'headline', 'id', 'summary', 'picture-url'];
};

// extend base provider
LinkedInProvider.prototype = Object.create(new Provider(), {});

/**
 *
 * @param profileId
 * @param callback
 */
LinkedInProvider.prototype.getProfile = function(profileId, callback) {
    IN.API.Profile(profileId)
        .fields(this.profileFields)
        .result(callback);
};

/**
 *
 * @param params
 * @param callback
 */
LinkedInProvider.prototype.search = function(params, callback) {
    if (!IN.ENV.auth.oauth_token) {
      alert("You must login w/ LinkedIn to use the Search functionality!");
      return;
    }

    // reset search state and response
    this.setState('search', 'loading')
        .setResponse('search', null);

    params.count = 10;
    params.sort  = 'distance';

    var self = this;

    IN.API.PeopleSearch()
        .fields(this.profileFields)
        .params(params)
        .result(function(response) {
            console.log('LinkedInProvider response length: ' + response.people.values.length);
            console.log(response);

            self.setState('search', 'loaded')
                .setResponse('search', self.formatResults(response.people.values));

            callback();
        })
        .error(function error(e) {
        }
    );
};

/**
 * Format a result to conform App requirements,
 * typical linked result fields:
 *   firstName:  "Raphaël"
 *   headline:   "ingénieur PHP chez Ekino"
 *   id:         "U-4GVmRWpo"
 *   lastName:   "Benitte"
 *   pictureUrl: "http://m3.licdn.com/mpr/mprx/0_vtozj_hhIqmApIN3zqd6j3iGwNRjYek3cvOEj3TgN-fDT2PTJNVJPTzP5MUGj75DNlHI-Q0ROTny"
 *
 * @param result
 * @return {Object}
 */
LinkedInProvider.prototype.formatResult = function(result) {

    return new ProviderResult(this.id, result.firstName + ' ' + result.lastName, result.headline, {
    });
};