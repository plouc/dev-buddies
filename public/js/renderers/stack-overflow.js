/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @param selector
 * @constructor
 */
var StackOverflowRenderer = function(app, selector) {

  var container = '<div class="stack-overflow-profile">';
  container += '<h2>Stack Overflow</h2>';
  container += '</div>';

  this.$container = $(container);
};

/**
 *
 * @return {StackOverflowRenderer}
 */
StackOverflowRenderer.prototype.init = function() {

  this.$container.append('<h3>Activity</h3>');

  this.$activity = $('<ul class="activity"></ul>');
  this.$container.append(this.$activity);

  return this;
};

/**
 *
 * @return {*}
 */
StackOverflowRenderer.prototype.getContainer = function() {
  return this.$container;
};

/**
 *
 * @return {*}
 */
StackOverflowRenderer.prototype.render = function(profile) {
};