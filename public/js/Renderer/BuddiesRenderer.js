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
BuddiesRenderer.prototype.init = function() {

  var self = this;

  this.$title = $('<h1>Buddies</h1>');
  this.$editButton = $('<a href="#">edit</a>');
  this.$editButton.on('click', function(e) {
    e.preventDefault();
    if (!self.$editButton.hasClass('editing')) {
      self.$editButton.text('done').addClass('editing');
      self.$list.find('li .remove').addClass('active');
    } else {
      self.$editButton.text('edit').removeClass('editing');
      self.$list.find('li .remove').removeClass('active').removeClass('pending');
    }
  });

  this.$title.append(this.$editButton);

  this.$container.append(this.$title);
  this.$list = $('<ul class="items"/>');
  this.$container.append(this.$list);

  return this;
};

/**
 * @param buddies
 */
BuddiesRenderer.prototype.render = function(buddies) {

  var self = this;

  _.each(buddies, function(buddy) {

    var $buddy = $('<li/>');
    $buddy.append('<h3>' + buddy.id + '</h3>');

    // two step removal
    var $remove = $('<a href="#" class="remove"><span>remove</span></a>');
    $remove.on('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // prevent parent li from triggering buddy.details event
      if ($remove.hasClass('pending')) {
        $(self).trigger('buddy.remove', [$buddy, buddy]);
      } else {
        $remove.addClass('pending');
      }
    });
    $buddy.append($remove);

    $buddy.on('click', function(e) {
      e.preventDefault();
      $(self).trigger('buddy.details', [buddy]);
    });

    self.$list.append($buddy);
  });
};


