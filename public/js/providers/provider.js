/**
 * (c) 2012-2013 Raphaël Benitte
 *
 * Base class for providers.
 *
 * @constructor
 */
var Provider = function() {

    this.states = {
        'search': 'idle'
    };

    this.responses = {
        'search': null
    };
};


Provider.prototype = {

    /**
     * Set command state.
     *
     * @param command
     * @param state
     * @return Provider
     */
    setState: function(command, state) {
        if (!this.states.hasOwnProperty(command)) {
            throw 'Invalid command ' + command;
        }

        this.states[command] = state;

        return this;
    },

    /**
     * Set command response.
     *
     * @param command
     * @param response
     * @return Provider
     */
    setResponse: function(command, response) {
        if (!this.responses.hasOwnProperty(command)) {
            throw 'Invalid command ' + command;
        }

        this.responses[command] = response;

        return this;
    },

    search: function() {
        throw 'You must implement the search method';
    },

    formatResult: function() {
        throw 'You must implement the formatResult method';
    },

    /**
     *
     * @param results
     */
    formatResults: function(results) {

        var self = this;

        return results.map(function(result) {
            return self.formatResult(result);
        });
    }
};