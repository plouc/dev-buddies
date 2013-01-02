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
        renderer.$query.val(query.substr(0, currentQueryIndex)).trigger('keyup');
        if (currentQueryIndex === query.length) {
            clearInterval(timer);
            renderer.$query.trigger('blur').trigger('mouseenter');
            renderer.$submit.trigger('focus');
            setTimeout(function() {
                renderer.$submit.trigger('click');
                setTimeout(function() {
                    renderer.$results.find('li.provider-stack-overflow').eq(0).trigger('focus');
                    setTimeout(function() {
                        renderer.$results.find('li.provider-stack-overflow').eq(0).click();
                        setTimeout(function() {
                            renderer.$results.find('li.provider-github').eq(0).trigger('focus');
                            setTimeout(function() {
                                renderer.$results.find('li.provider-github').eq(0).click();
                                setTimeout(function() {
                                    renderer.$results.find('li.provider-linkedin').eq(0).trigger('focus');
                                    setTimeout(function() {
                                        renderer.$results.find('li.provider-linkedin').eq(0).click();
                                        setTimeout(function() {
                                            renderer.$build.find('a').click();
                                        }, 600);
                                    }, 400);
                                }, 600);
                            }, 400);
                        }, 600);
                    }, 400);
                }, 4000);
            }, 600);
        }
    }, 60);
};


$(document).ready(function() {

    var $panelContainer = $('.panel-container'),
        $currentPanel   = $('.panel.active');

    $('.nav').on('click', 'a', function(e) {
        e.preventDefault();

        var $navButton    = $(this),
            panelSelector = $navButton.attr('href'),
            $panel        = $(panelSelector);

        $('.nav a').removeClass('active');
        $navButton.addClass('active');
        $panelContainer.animate({
            'left': '-' + ($panel.index() * 20) + '%'
        }, 200);
    });

    var searchRenderer = new SearchRenderer(app, '.search');
    searchRenderer.init();

    $(searchRenderer).on('submit', function(e, query) {
        app.search(query, function(results) {
            searchRenderer.resultsLoaded().render(results);
        });
    }).on('build.init', function(e, selected) {
        console.log(selected);
    });

    /*
    // sample scenario
    setTimeout(function() {
        $('.nav .search-button a').trigger('focus');
        setTimeout(function() {
            $('.nav .search-button a').trigger('click');
        }, 400);
        setTimeout(function() {
            searchSimulator(app, searchRenderer, 'Olivier Bazoud');
        }, 1400);
    }, 2000);
    */
});