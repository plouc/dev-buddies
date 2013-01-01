/**
 * (c) 2012-2013 Raphaël Benitte
 *
 * @param selector
 * @constructor
 */
var SearchRenderer = function(selector) {
    this.$container = $(selector);
    this.$query     = this.$container.find('input[name="search"]');
    this.$submit    = this.$container.find('a');
    this.$toggle    = this.$container.find('.toggle');
    this.$overlay   = this.$container.find('.overlay');
    this.$results   = $('.search-results');
};

/**
 *
 * @return {*}
 */
SearchRenderer.prototype.init = function() {

    var self = this;

    this.$toggle.click(function() {
        if (self.$container.hasClass('closed')) {
            self.$container.removeClass('closed');
        } else {
            self.$container.addClass('closed');
        }
    });

    this.$submit.click(function(e) {
        e.preventDefault();
        self.$overlay.css('display', 'block');
        $(self).trigger('submit', [self.$query.val()]);
    });

    return this;
};

/**
 *
 * @return {*}
 */
SearchRenderer.prototype.resultsLoaded = function() {

    this.$overlay.css('display', 'none');
    this.$container.addClass('closed');

    return this;
};

/**
 *
 * @param results
 */
SearchRenderer.prototype.render = function(results) {

    var self = this;

    this.$results.html('').css('opacity', 0);

    results.forEach(function(result) {

        var resultContent = '<li class="provider-' + result.providerName;
        if (result.picture !== null) {
            resultContent += ' has-picture">';
            resultContent += '<img class="picture" src="' + result.picture + '" alt="' + result.fullname + '"/>';
        } else {
            resultContent += ' no-picture">';
        }
        resultContent += '<h2>' + result.fullname + '</h2>';
        resultContent += '<p>' + result.description + '</p>';
        resultContent += '<a href="#" class="validate"><i></i></a>';
        resultContent += '</li>';

        var $result = $(resultContent);

        $result.click(function(e) {
        });

        self.$results.append($result).animate({
            'opacity': 1
        }, 600);
    });

    return this;
};