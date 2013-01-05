/**
 * (c) 2012-2013 Raphaël Benitte (http://rbenitte.com)
 */
$(document).ready(function() {

  var app             = new App()
    , searchRenderer  = new SearchRenderer(app, '.search')
    , buddiesRenderer = new BuddiesRenderer($('#buddies-list'))
    , $panelContainer = $('.panel-container')
    , storage         = new Storage()
    , $buddyProfile   = $('#buddy-profile');


  searchRenderer.init();
  buddiesRenderer.init();


  storage.init(function() {
    app.setStorage(storage);
    storage.dumpStore('buddies', function(buddies) {
      buddiesRenderer.render(buddies);
    });
  });


  $('.nav').on('click', 'a', function(e) {
    e.preventDefault();

    var $navButton    = $(this)
      , panelSelector = $navButton.attr('href');

    gotoPanel(panelSelector);
    $('.nav a').removeClass('active');
    $navButton.addClass('active');
  });


  _.each(app.providers, function(provider, providerName) {
    $buddyProfile.append(app.getProviderRenderer(providerName).getContainer());
  });


  $(searchRenderer).on('submit', function(e, query) {
    app.search(query, function(results) {
      searchRenderer.resultsLoaded().render(results);
    });
  }).on('build.init', function(e, results) {
    app.getUserProfile(results, function(results) {
      searchRenderer.$mainOverlay.css('display', 'none');
      app.storeProfileResult(results);
      _.each(results, function(providerUserProfile, providerName) {
        app.getProviderRenderer(providerName).render(providerUserProfile);
      });
      gotoPanel('#buddy-profile');
    });
  });


  var gotoPanel = function(selector) {

    var $panel    = $(selector)
      , $subpanel = null;

    if ($panel.hasClass('subpanel')) {
      $subpanel = $panel;
      $panel    = $subpanel.parents('.panel');
    }

    $panelContainer.animate({
      'left': '-' + ($panel.index() * 20) + '%'
    }, 400);

    if ($subpanel !== null) {
      var $subpanelContainer = $panel.find('.subpanel-container');

      setTimeout(function() {
        $subpanelContainer.animate({
          'top': '-' + ($subpanel.index() * 100) + '%'
        }, 400);
      }, 400);
    }
  };
});