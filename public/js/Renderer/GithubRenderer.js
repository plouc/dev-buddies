/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @param selector
 * @constructor
 */
var GithubRenderer = function (app, selector) {
  "use strict";

  var container = '<div class="github-profile">';
  container += '<h2>Github</h2>';
  container += '</div>';

  this.$container = $(container);
};

/**
 *
 * @return {GithubRenderer}
 */
GithubRenderer.prototype.init = function () {
  "use strict";

  var self = this;

  this.$container.append('<h3>Repositories</h3>');
  this.$repos = $('<ul class="repositories items"></ul>');
  this.$container.append(this.$repos);

  this.$container.append('<h3>Activity</h3>');
  this.$activity = $('<ul class="activity items"/>');
  this.$moreActivity = $('<div class="more"></span>');
  this.$container.append(this.$activity);
  this.$container.append(this.$moreActivity);

  this.$container.find('.more').on('click', function (e) {
    e.preventDefault();
    self.$activity.find('li:gt(4)').show();
  });

  return this;
};

/**
 *
 * @return {jQueryObject}
 */
GithubRenderer.prototype.getContainer = function () {
  "use strict";

  return this.$container;
};

/**
 *
 * @return {GithubRenderer}
 */
GithubRenderer.prototype.render = function (profile) {
  "use strict";

  var self = this,
    eventDescription,
    currentDateDay = null;

  this.$activity.html('');
  this.$repos.html('');

  if (profile.repos) {
    _.each(profile.repos, function (repo) {
      self.$repos.append('<li>' +
          '<a href="' + repo.html_url + '">' + repo.name + '</a>' +
          ' <span class="meta">' + repo.description + '</span>' +
        '</li>');
    });
  }

  if (profile.events) {
    _.each(profile.events, function (event) {

      var createdAt = new Date(event.created_at),
        month       = createdAt.getMonth() + 1,
        day         = createdAt.getDate(),
        hours       = createdAt.getHours(),
        minutes     = createdAt.getMinutes(),
        repo        = null,
        branch      = null,
        commits     = null,
        comment     = null,
        dateDay,
        dateTime;


      dateDay = createdAt.getFullYear()    + '-' +
        (month < 10 ? '0' + month : month) + '-' +
        (day   < 10 ? '0' + day   : day);

      dateTime = (hours   < 10 ? '0' + hours   : hours) + ':' +
                 (minutes < 10 ? '0' + minutes : minutes);

      if (dateDay !== currentDateDay) {
        self.$activity.append('<li class="day">' + dateDay + '</li>');
        currentDateDay = dateDay;

      }

      if (event.repo) {
        repo = '<a href="https://github.com/' + event.repo.name + '">' + event.repo.name + '</a>';
      }

      if (event.payload && event.payload.ref_type && event.payload.ref_type === 'branch') {
        branch = '<a href="https://github.com/' + event.repo.name + '/tree/' + event.payload.ref + '">' + event.payload.ref + '</a>';
      }

      if (event.payload && event.payload.commits) {
        if (event.payload.commits.length === 1) {
          /*
          commits = '<a href="#">' + event.payload.commits[0].sha.substr(0, 10) + '</a> ' +
                    '<i>' + event.payload.commits[0].message.substr(0, 24) + '...</i>';
          */
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

      eventDescription = '<span class="date">' + dateTime + '</span> ';
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
        eventDescription += ' ' + event.type;
        break;
      }

      self.$activity.append('<li>' + eventDescription + '</li>');
    });

    var $items = self.$activity.find('li');
    if ($items.length > 3) {
      this.$moreActivity.css('display', 'block');
      $items.filter(':gt(4)').css('display', 'none');
    }
  }

  return this;
};