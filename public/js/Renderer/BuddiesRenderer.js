/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @constructor
 */
var BuddiesRenderer = function ($container) {
  "use strict";

  this.$container = $container;
};

/**
 *
 * @return {*}
 */
BuddiesRenderer.prototype.init = function () {
  "use strict";

  var self = this;
  var $wrapper = $('<div class="panel-wrapper"/>');
  this.$list = $('<ul class="items"/>');
  $wrapper.append(this.$list);

  return this;
};

/**
 * @param buddies
 */
BuddiesRenderer.prototype.render = function (buddies) {
  "use strict";

  var self = this;

  self.$list.html('');

  buddies = _.values(buddies);
  buddies.sort(function compare(a, b) {
    if (a.id.toLowerCase() < b.id.toLowerCase()) {
      return -1;
    }
    if (a.id.toLowerCase() > b.id.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  var currentStartLetter;

  _.each(buddies, function (buddy) {

    var buddyStartLetter = buddy.id.substr(0, 1).toLocaleUpperCase(),
      $buddy             = $('<li/>'),
      $remove            = $('<a href="#" class="remove"><span>remove</span></a>');

    if (buddyStartLetter !== currentStartLetter) {
      self.$list.append('<li class="letter">' + buddyStartLetter + '</li>');
      currentStartLetter = buddyStartLetter;
    }

    $buddy.append('<h3>' + buddy.id + '</h3>');

    // two step removal
    $remove.on('click', function (e) {
      e.preventDefault();
      e.stopPropagation(); // prevent parent li from triggering buddy.details event
      if ($remove.hasClass('pending')) {
        $(self).trigger('buddy.remove', [$buddy, buddy]);
      } else {
        $remove.addClass('pending');
      }
    });
    $buddy.append($remove);

    $buddy.on('click', function (e) {
      e.preventDefault();
      $(self).trigger('buddy.details', [buddy]);
    });

    self.$list.append($buddy);
  });
};
