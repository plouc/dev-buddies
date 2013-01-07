/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author Raphaël Benitte
 * @constructor
 */
var SettingsRenderer = function ($container) {
  "use strict";

  this.$container = $container;
  this.$container.append('<h2>Providers</h2>');
  this.$providers = $('<ul class="providers items"></ul>');
  this.$container.append(this.$providers);
};

/**
 * @param {Object} providers
 * @return {SettingsRenderer}
 */
SettingsRenderer.prototype.renderProviders = function (providers) {
  "use strict";

  var self = this;

  _.each(providers, function (provider) {
    self.$providers.append('<li class="' + provider.id + '">' +
        '<span class="name">' + provider.name + '</span>' +
        '<span class="quota">' +
          'API max quota <span class="max">n/a</span>, remaining <span class="remaining">n/a</span>' +
        '</span>' +
        '<span class="switch on">' +
            '<span><span>on</span><span>off</span><i></i></span>' +
        '</span>' +
      '</li>');
  });

  return this;
};

/**
 * @param {String} providerId
 * @param {Number} max
 * @param {Number} remaining
 * @return {SettingsRenderer}
 */
SettingsRenderer.prototype.updateQuota = function (providerId, max, remaining) {
  "use strict";

  var $quota = this.$providers.find('.' + providerId).find('.quota');

  $quota.find('.max').text(max);
  $quota.find('.remaining').text(remaining);

  return this;
};