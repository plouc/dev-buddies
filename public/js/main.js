var app = new App();

/**
 * LinkedIn event handlers
 */
var onLinkedInLoaded = function() {
    //app.getProvider('linkedin').loaded = true;
};
var onLinkedInAuth = function() {
    //app.getProvider('linkedin').authenticated = true;
};

var searchSimulator = function(app, renderer, query) {
    renderer.$container.removeClass('closed');
    renderer.$query.val('').trigger('focus');
    var currentQueryIndex = 0;
    var timer = setInterval(function() {
        currentQueryIndex++;
        renderer.$query.val(query.substr(0, currentQueryIndex));
        if (currentQueryIndex === query.length) {
            clearInterval(timer);
            renderer.$query.trigger('blur');
            renderer.$submit.trigger('focus');
            setTimeout(function() {
                renderer.$submit.trigger('click');
            }, 600);
        }
    }, 60);
};


$(document).ready(function() {

    var $currentPanel  = $('.home');

    var searchRenderer = new SearchRenderer('.search');
    searchRenderer.init();

    $(searchRenderer).on('submit', function(e, query) {
        app.search(query, function(results) {
            searchRenderer.resultsLoaded().render(results);
        });
    });

    setTimeout(function() {
        searchSimulator(app, searchRenderer, 'Paul Irish');
    }, 1000);
});