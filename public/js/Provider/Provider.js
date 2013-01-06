/**
 * Base class for providers.
 *
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @constructor
 */
var Provider = function () {
  "use strict";

  this.states = {
    "search":         "idle",
    "getUserProfile": "idle"
  };

  this.responses = {
    "search":         null,
    "getUserProfile": null
  };
};

/**
 * Set command state.
 *
 * @param {String} command
 * @param {String} state
 * @return {Provider}
 */
Provider.prototype.setState = function (command, state) {
  "use strict";

  if (!this.states.hasOwnProperty(command)) {
    throw 'Invalid command ' + command;
  }

  this.states[command] = state;

  return this;
};

/**
 *
 * @param {String} command
 * @return {String}
 */
Provider.prototype.getState = function (command) {
  "use strict";

  if (!this.states.hasOwnProperty(command)) {
    throw 'Invalid command ' + command;
  }

  return this.states[command];
};

/**
 * Set command response.
 *
 * @param {String} command
 * @param {Object} response
 * @return {Provider}
 */
Provider.prototype.setResponse = function (command, response) {
  "use strict";

  if (!this.responses.hasOwnProperty(command)) {
    throw 'Invalid command ' + command;
  }

  this.responses[command] = response;

  return this;
};

Provider.prototype.search = function () {
  "use strict";
  throw 'You must implement the search method';
};

Provider.prototype.getUserProfile = function (result) {
  "use strict";
  throw 'You must implement the getUserProfile method';
};

Provider.prototype.formatSearchResult = function () {
  "use strict";
  throw 'You must implement the formatSearchResult method';
};

/**
 *
 * @param {Array} results
 */
Provider.prototype.formatSearchResults = function (results) {
  "use strict";

  var self = this;

  return results.map(function (result) {
    return self.formatSearchResult(result);
  });
};