/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @constructor
 */
var BuddiesRenderer = function($container) {
  this.$container = $container;
};

/**
 *
 * @return {*}
 */
BuddiesRenderer.prototype = {
  init: function() {

    this.$container.append('<h1>Buddies</h1>');
    this.$list = $('<ul class="items"/>');
    this.$container.append(this.$list);

    return this;
  }

  /**
   * @param buddies
   */
  , render: function(buddies) {

    var self = this;

    _.each(buddies, function(buddy) {
      self.$list.append('<li>' + buddy.id + '</li>');
    });
  }
};

