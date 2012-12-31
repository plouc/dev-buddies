/**
 * (c) 2012-2013 Raphaël Benitte
 *
 * Github specific provider.
 *
 * @constructor
 */
var GithubProvider = function() {

    Provider.call(this);

    this.id = 'github';

    this.baseUrls = {
        userSearch: 'https://api.github.com/legacy/user/search/'
    };
};

// extend base provider
GithubProvider.prototype = Object.create(new Provider(), {});

/**
 *
 * @param params
 * @param callback
 */
GithubProvider.prototype.search = function(params, callback) {

    // reset search state and response
    this.setState('search', 'loading')
        .setResponse('search', null);

    var self  = this,
        terms = params.keywords;

    $.ajax({
        url: this.baseUrls.userSearch + terms,
        success: function(response) {
            console.log('GithubProvider response length: ' + response.users.length);
            console.log(response);

            self.setState('search', 'loaded')
                .setResponse('search', self.formatResults(response.users));

            callback();
        }
    });
};

/**
 * Format a result to conform App requirements,
 * typical github result fields:
 *   created:            "2008-12-12T16:41:45-08:00"
 *   created_at:        "2008-12-12T16:41:45-08:00"
 *   followers:         1
 *   followers_count:   1
 *   fullname:          null
 *   id:                "user-"
 *   language:          null
 *   location:          null
 *   login:             "undefined"
 *   name:              null
 *   public_repo_count: 0
 *   repos:             0
 *   type:              "user"
 *   username:          "undefined"
 *
 * @param result
 * @return {Object}
 */
GithubProvider.prototype.formatResult = function(result) {

    return new ProviderResult(this.id, result.login, '', {
        created_at: result.created_at
    });
};