/**
 * (c) 2012-2013 Raphaël Benitte
 *
 * LinkedIn specific provider.
 *
 * @constructor
 */
var LinkedInProvider = function() {

    Provider.call(this);

    this.name = 'linkedin';

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
 * @param query
 * @param callback
 */
LinkedInProvider.prototype.search = function(query, callback) {

    // when user is not authenticated, we exit and return an empty result
    if (!IN.ENV.auth || !IN.ENV.auth.oauth_token || !IN.API) {
        this.setState('search', 'loaded')
            .setResponse('search', []);

        callback();
        return;
    }

    // reset search state and response
    this.setState('search', 'loading')
        .setResponse('search', null);

    var params = {
        'keywords': query,
        'count':    10,
        'sort':     'distance'
    };

    var self = this;

    IN.API.PeopleSearch()
        .fields(this.profileFields)
        .params(params)
        .result(function(response) {
            console.log('LinkedInProvider response:');
            console.log(response);

            self.setState('search', 'loaded');
            if (response.people.hasOwnProperty('values')) {
                self.setResponse('search', self.formatResults(response.people.values));
            } else {
                self.setResponse('search', []);
            }


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

    var picture = null;
    if (result.hasOwnProperty('pictureUrl')) {
        picture = result.pictureUrl;
    }

    return new ProviderResult(this.name, result.firstName + ' ' + result.lastName, result.headline, picture, result);
};