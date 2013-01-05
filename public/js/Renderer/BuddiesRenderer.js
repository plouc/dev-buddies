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
      console.log('Entering buddies edit mode');
      self.$editButton.text('done').addClass('editing');
      self.$list.find('li .remove').css('display', 'inline-block');
    } else {
      console.log('Exiting buddies edit mode');
      self.$editButton.text('edit').removeClass('editing');
      self.$list.find('li .remove').css('display', 'none');
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

    var $remove = $('<a href="#" class="remove"/>');
    $remove.on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Remove buddy');
      //$(self).trigger('buddy.remove', [buddy]);
    });
    $buddy.append($remove);

    $buddy.on('click', function(e) {
      e.preventDefault();
      $(self).trigger('buddy.details', [buddy]);
    });

    console.log('Rendering buddy', buddy);
    self.$list.append($buddy);
  });
};


