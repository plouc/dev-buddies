var app = new App();

/**
 * LinkedIn
 */
var onLinkedInLoaded = function() {
    app.getProvider('linkedin').loaded = true;
};
var onLinkedInAuth = function() {
    app.getProvider('linkedin').authenticated = true;
};

$(document).ready(function() {

    var $currentPanel = $('.home'),
        $search       = $('.search'),
        $firstname    = $('input[name="firstname"]'),
        $lastname     = $('input[name="lastname"]'),
        $searchButton = $('.search a'),
        $searchToggle = $('.search .toggle');

    var renderResults = function(results) {
        var $resultContainer = $('.search-result');

        $resultContainer.html('');

        results.forEach(function(result) {
            var $result = $('<li/>');
            $result.append('<h2>' + result.fullname + '</h2>');
            $result.append('<p>' + result.description + '</p>');

            $result.click(function(e) {
                $currentPanel.addClass('closed');
            });

            $resultContainer.append($result);
        });
    };

    $searchButton.click(function(e) {
        e.preventDefault();
        app.search({
            keywords: $firstname.val() + ' ' + $lastname.val()
        }, renderResults);
    });

    $searchToggle.click(function() {
        if ($search.hasClass('closed')) {
            $search.removeClass('closed');
        } else {
            $search.addClass('closed');
        }
    });
});