/**
 * Github specific provider.
 *
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @augments Provider
 * @constructor
 */
var GithubProvider = function () {
  'use strict';

  Provider.call(this);

  this.id      = 'github';
  this.name    = 'github';
  this.enabled = true;
  this.quota   = {
    max:       'n/a',
    remaining: 'n/a'
  };

  this.baseUrls = {
    userSearch:  "https://api.github.com/legacy/user/search/:query",
    userProfile: "https://api.github.com/users/:user",
    userEvents:  "https://api.github.com/users/:user/events/public",
    userRepos:   "https://api.github.com/users/:user/repos"
  };
};

// extend base provider
GithubProvider.prototype = Object.create(new Provider(), {});

/**
 *
 * @param {String} query
 * @param {Function} callback
 */
GithubProvider.prototype.search = function (query, callback) {
  'use strict';

  var self = this;

  $.ajax({
    url: this.baseUrls.userSearch.replace(':query', query),
    dataType: 'jsonp',
    success: function (response) {
      console.log('GithubProvider response:');
      console.log(response);

      if (response.meta) {
        if (response.meta.status && response.meta.status === 403) {
          callback([]);
          console.log('Github rate limit exceeded');
          return;
        }
        self.quota.max       = response.meta['X-RateLimit-Limit'];
        self.quota.remaining = response.meta['X-RateLimit-Remaining'];
      }

      callback(self.formatSearchResults(response.data.users));
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('GithubProvider error: ' + errorThrown);

      callback({});
    }
  });
};

/**
 * Retrieve informations about an user from a search result.
 *
 * @param {Object} result
 * @param {Function} callback
 */
GithubProvider.prototype.getUserProfile = function (result, callback) {
  'use strict';

  var self            = this,
    responseCount     = 0,
    compositeResponse = {};

  var onResponse = function () {
    if (responseCount === 3) {
      console.log('GithubProvider.getUserProfile() response:');
      console.log(compositeResponse);

      if (_.isFunction(callback)) {
        callback(compositeResponse);
      }
    }
  };

  $.ajax({
    url: this.baseUrls.userEvents.replace(':user', result.userId),
    dataType: "jsonp",
    success: function (response) {
      if (response.meta) {
        self.quota.max       = response.meta['X-RateLimit-Limit'];
        self.quota.remaining = response.meta['X-RateLimit-Remaining'];
      }
      compositeResponse.events = self.formatEvents(response.data);
      responseCount++;
      onResponse();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      compositeResponse.events = null;
      responseCount++;
      onResponse();
    }
  });

  $.ajax({
    url: this.baseUrls.userRepos.replace(':user', result.raw.login),
    dataType: "jsonp",
    success: function (response) {
      if (response.meta) {
        self.quota.max       = response.meta['X-RateLimit-Limit'];
        self.quota.remaining = response.meta['X-RateLimit-Remaining'];
      }
      compositeResponse.repos = response.data;
      responseCount++;
      onResponse();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      compositeResponse.repos = null;
      responseCount++;
      onResponse();
    }
  });

  $.ajax({
    "url": this.baseUrls.userProfile.replace(':user', result.raw.login),
    "dataType": "jsonp",
    "success": function (response) {
      if (response.meta) {
        self.quota.max       = response.meta['X-RateLimit-Limit'];
        self.quota.remaining = response.meta['X-RateLimit-Remaining'];
      }
      compositeResponse.profile = response.data;
      if (response.data.avatar_url) {
        console.log(response.data.avatar_url);
        compositeResponse.avatar = response.data.avatar_url;
      }
      responseCount++;
      onResponse();
    },
    "error": function (jqXHR, textStatus, errorThrown) {
      compositeResponse.profile = null;
      responseCount++;
      onResponse();
    }
  });
};


/**
 * Format Github Events
 *
 * @return {GithubProvider}
 */
GithubProvider.prototype.formatEvents = function (events) {
  'use strict';

  var eventDescription;

  _.each(events, function (event) {

    var createdAt = new Date(event.created_at),
      month       = createdAt.getMonth() + 1,
      day         = createdAt.getDate(),
      hours       = createdAt.getHours(),
      minutes     = createdAt.getMinutes(),
      repo        = null,
      branch      = null,
      commits     = null,
      comment     = null;


    event.dateDay = createdAt.getFullYear()    + '-' +
      (month < 10 ? '0' + month : month) + '-' +
      (day   < 10 ? '0' + day   : day);

    event.dateTime = (hours   < 10 ? '0' + hours   : hours) + ':' +
                     (minutes < 10 ? '0' + minutes : minutes);

    if (event.repo) {
      repo = '<a href="https://github.com/' + event.repo.name + '">' + event.repo.name + '</a>';
    }

    if (event.payload && event.payload.ref_type && event.payload.ref_type === 'branch') {
      branch = '<a href="https://github.com/' + event.repo.name + '/tree/' + event.payload.ref + '">' + event.payload.ref + '</a>';
    }

    if (event.payload && event.payload.commits) {
      if (event.payload.commits.length === 1) {
        commits = '<i>' + event.payload.commits[0].message.substr(0, 36) + '...</i>';
      } else {
        commits = event.payload.size + ' commits';
      }
    }

    if (event.payload && event.payload.comment) {
      comment = '<i>' + event.payload.comment.body.substr(0, 36) + '...</i>';
      if (event.payload.comment.commit_id) {
        commits = event.payload.comment.commit_id.substr(0, 10);
      }
    }

    eventDescription = '';
    switch (event.type) {
    case 'ForkEvent':
      eventDescription += 'forked repo ' + repo;
      break;
    case 'PushEvent':
      eventDescription += 'pushed in repo ' + repo + ': ' + commits;
      break;
    case 'CreateEvent':
      if (branch !== null) {
        eventDescription += 'created branch ' + branch + ' for repo ' + repo;
      } else {
        eventDescription += 'created repo ' + repo;
      }
      break;
    case 'CommitCommentEvent':
      eventDescription += 'commented commit ' + commits + ': ' + comment;
      break;
    case 'PullRequestEvent':
    case 'IssuesEvent':
    default:
      eventDescription += event.type;
      break;
    }

    event.description = eventDescription;
  });

  return events;
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
 * @param {Object} result
 * @return {ProviderResult}
 */
GithubProvider.prototype.formatSearchResult = function (result) {
  'use strict';

  var fullname = result.login;
  if (result.fullname !== null && result.fullname !== '') {
    fullname += ' [' + result.fullname + ']';
  }

  var description = '';
  if (result.language !== null) {
    description = result.language + ' developper';
  }

  return new ProviderResult(this.id, result.login, fullname, description, null, result);
};