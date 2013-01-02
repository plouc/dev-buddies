/**
 * (c) 2012-2013 Raphaël Benitte
 *
 * Stack Overflow specific provider.
 *
 * @constructor
 */
var StackOverflowProvider = function() {

    Provider.call(this);

    this.name = 'stack-overflow';

    this.baseUrls = {
        userSearch: 'https://api.stackexchange.com/2.1/users' //?order=desc&sort=reputation&inname=mlarcher&site=stackoverflow
    };
};

// extend base provider
StackOverflowProvider.prototype = Object.create(new Provider(), {});

/**
 *
 * @param query
 * @param callback
 */
StackOverflowProvider.prototype.search = function(query, callback) {

    // reset search state and response
    this.setState('search', 'loading')
        .setResponse('search', null);

    var self = this;

    $.ajax({
        url: this.baseUrls.userSearch,
        dataType: 'json',
        data: {
            'order':  'asc',
            'sort':   'name',
            'site':   'stackoverflow',
            'inname': query
        },
        success: function(response) {
            console.log('StackOverflowProvider response:');
            console.log(response);

            self.setState('search', 'loaded')
                .setResponse('search', self.formatResults(response.items));

            callback();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('StackOverflowProvider error: ' + errorThrown);

            self.setState('search', 'loaded')
                .setResponse('search', []);

            callback();
        }
    });
};

/**
 * Format a result to conform App requirements,
 * typical github result fields:
 *   account_id:                433288
 *   badge_counts:              Object
 *   creation_date:             1309238312
 *   display_name:              "ᴺᴱᴼᴺ"
 *   is_employee:               false
 *   last_access_date:          1356421858
 *   last_modified_date:        1347362334
 *   link:                      "http://stackoverflow.com/users/818544/"
 *   location:                  "Thai"
 *   profile_image:             "http://www.gravatar.com/avatar/894891fa86576454f1cab28c28625425?d=identicon&r=PG"
 *   reputation:                13
 *   reputation_change_day:     0
 *   reputation_change_month:   0
 *   reputation_change_quarter: 0
 *   reputation_change_week:    0
 *   reputation_change_year:    12
 *   user_id:                   818544
 *   user_type:                 "registered"
 *   website_url:               ""
 *
 * @param result
 * @return {Object}
 */
StackOverflowProvider.prototype.formatResult = function(result) {

    return new ProviderResult(this.name, result.display_name, '', result.profile_image, result);
};