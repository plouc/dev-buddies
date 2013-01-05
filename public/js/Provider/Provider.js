/**
 * Base class for providers.
 *
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @constructor
 */
var Provider = function() {

  this.states = {
      "search":         "idle"
    , "getUserProfile": "idle"
  };

  this.responses = {
      "search":         null
    , "getUserProfile": null
  };
};


Provider.prototype = {

  /**
   * Set command state.
   *
   * @param {String} command
   * @param {String} state
   * @return {Provider}
   */
  setState: function(command, state) {
    if (!this.states.hasOwnProperty(command)) {
      throw 'Invalid command ' + command;
    }

    this.states[command] = state;

    return this;
  }

  /**
   *
   * @param {String} command
   * @return {String}
   */
  , getState: function(command) {
    if (!this.states.hasOwnProperty(command)) {
      throw 'Invalid command ' + command;
    }

    return this.states[command];
  }

  /**
   * Set command response.
   *
   * @param {String} command
   * @param {Object} response
   * @return {Provider}
   */
  , setResponse: function(command, response) {
    if (!this.responses.hasOwnProperty(command)) {
      throw 'Invalid command ' + command;
    }

    this.responses[command] = response;

    return this;
  }

  , search: function() {
    throw 'You must implement the search method';
  }

  , getUserProfile: function(result) {
    throw 'You must implement the getUserProfile method';
  }

  , formatResult: function() {
    throw 'You must implement the formatResult method';
  }

  /**
   *
   * @param {Array} results
   */
  , formatResults: function(results) {

    var self = this;

    return results.map(function(result) {
      return self.formatResult(result);
    });
  }
};