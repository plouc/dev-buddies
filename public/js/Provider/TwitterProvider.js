/**
 * Twitter specific provider.
 *
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @augments Provider
 * @constructor
 */
var TwitterProvider = function() {

    Provider.call(this);

    this.name = 'twitter';

    this.baseUrls = {
        userSearch: 'https://api.twitter.com/1.1/users/search.json'
    };
};

// extend base provider
TwitterProvider.prototype = Object.create(new Provider(), {});

/**
 *
 * @param query
 * @param callback
 * @example
 * var twitterProvider = new TwitterProvider();
 * twitterProvider.search('Douglas Crockford', function(result) {
 *   console.log(result);
 * });
 */
TwitterProvider.prototype.search = function(query, callback) {

    // reset search state and response
    this.setState('search', 'loading')
        .setResponse('search', null);

    var self = this;

    try {
        $.ajax({
            url: this.baseUrls.userSearch,
            data: {
                'q': query
            },
            dataType: 'jsonp',
            success: function(response) {
                console.log('TwitterProvider response:');
                console.log(response);

                self.setState('search', 'loaded')
                    .setResponse('search', self.formatResults(response.users));

                callback(response.users);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('TwitterProvider error: ' + errorThrown);

                self.setState('search', 'loaded')
                    .setResponse('search', []);

                callback({});
            }
        });
    } catch (error) {
        console.log(Error, error);
    }
};

/**
 * Format a result to conform App requirements,
 * typical github result fields:
 *
 * @param result
 * @return {Object}
 */
TwitterProvider.prototype.formatResult = function(result) {

    var fullname = result.login;
    if (result.fullname !== null && result.fullname != '') {
        fullname += ' [' + result.fullname + ']';
    }

    var description = '';
    if (result.language !== null) {
        description = result.language + ' developper';
    }

    return new ProviderResult(this.name, fullname, description, null, result);
};