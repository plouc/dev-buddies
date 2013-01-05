/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @param selector
 * @constructor
 */
var GithubRenderer = function(app, selector) {

  var container = '<div class="github-profile">';
  container += '<h2>Github</h2>';
  container += '</div>';

  this.$container = $(container);
};

/**
 *
 * @return {GithubRenderer}
 */
GithubRenderer.prototype.init = function() {

  var self = this;

  this.$container.append('<h3>Activity</h3>');

  this.$activity = $('<ul class="activity items"/>');
  this.$moreActivity = $('<div class="more"><span>more...</span></span>');
  this.$container.append(this.$activity);
  this.$container.append(this.$moreActivity);

  this.$container.find('.more span').on('click', function(e) {
      e.preventDefault();
      self.$activity.find('li:gt(2)').show();
  });

  return this;
};

/**
 *
 * @return {jQueryObject}
 */
GithubRenderer.prototype.getContainer = function() {
  return this.$container;
};

/**
 *
 * @return {GithubRenderer}
 */
GithubRenderer.prototype.render = function(profile) {

  var self = this
    , eventDescription;

  this.$activity.html('');

  if (profile.events) {
    _(profile.events).each(function(event) {

      if (event.repo) {
        var repo = '<a href="https://github.com/' + event.repo.name + '">' + event.repo.name + '</a>';
      }

      var createdAt = new Date(event.created_at)
        , month     = createdAt.getMonth() + 1
        , day       = createdAt.getDate()
        , hours     = createdAt.getHours()
        , minutes   = createdAt.getMinutes();

      createdAt = createdAt.getFullYear()         + '-'
        + (month   < 10 ? '0' + month   : month ) + '-'
        + (day     < 10 ? '0' + day     : day )   + ' '
        + (hours   < 10 ? '0' + hours   : hours ) + ':'
        + (minutes < 10 ? '0' + minutes : minutes );


      eventDescription = '<span class="date">' + createdAt + '</span> ';
      switch (event.type) {
        case 'ForkEvent':
          eventDescription += 'forked repo ' + repo;
          break;
        case 'PushEvent':
          eventDescription += 'pushed in repo ' + repo;
          break;
        case 'PullRequestEvent':
        case 'IssuesEvent':
        case 'CreateEvent':
        default:
          eventDescription += ' ' + event.type;
          break;
      }
      self.$activity.append('<li>' + eventDescription + '</li>');
    });

    var $items = self.$activity.find('li');
    if ($items.length > 3) {
      this.$moreActivity.css('display', 'block');
      $items.filter(':gt(2)').css('display', 'none');
    }
  }

  return this;
};