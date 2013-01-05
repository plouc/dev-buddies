/**
 * (c) 2012-2013 Raphaël Benitte (http://rbenitte.com)
 */
$(document).ready(function() {

  var app             = new App()
    , searchRenderer  = new SearchRenderer(app, '.search')
    , buddiesRenderer = new BuddiesRenderer($('#buddies-list'))
    , buddyRenderer   = new BuddyRenderer($('buddy-profile'))
    , $panelContainer = $('.panel-container')
    , storage         = new Storage()
    , $buddyProfile   = $('#buddy-profile');


  searchRenderer.init();
  buddiesRenderer.init();

  $(buddiesRenderer).on('buddy.details', function(e, profile) {
    _.each(profile.providerData, function(providerProfileData, providerName) {
      app.getProviderRenderer(providerName).render(providerProfileData.data);
      gotoPanel('#buddy-profile');
    });
  }).on('buddy.remove', function(e, profile) {
    app.removeProfile(profile);
  });

  $('#home .presentation a').on('click', function(e) {
    e.preventDefault();
    gotoPanel('#search', function() {
      searchRenderer.$query.focus();
    });
  });

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
    app.search(query, function(query, results) {
      searchRenderer.resultsLoaded().render(results);
    });
  }).on('build.init', function(e, results) {
    app.getUserProfile('test-user', results, function(profile) {

      searchRenderer.$mainOverlay.css('display', 'none');
      app.storeProfile(profile);

      _.each(profile.providerData, function(providerProfileData, providerName) {
        app.getProviderRenderer(providerName).render(providerProfileData.data);
      });

      gotoPanel('#buddy-profile');
    });
  });


  var gotoPanel = function(selector, callback) {

    var $panel    = $(selector)
      , $subpanel = null;

    if ($panel.hasClass('subpanel')) {
      $subpanel = $panel;
      $panel    = $subpanel.parents('.panel');
    }

    $panelContainer.animate({
      'left': '-' + ($panel.index() * 20) + '%'
    }, 400, function() {
      if ($subpanel === null && callback) {
        callback();
      }
    });

    if ($subpanel !== null) {
      var $subpanelContainer = $panel.find('.subpanel-container');

      setTimeout(function() {
        $subpanelContainer.animate({
          'top': '-' + ($subpanel.index() * 100) + '%'
        }, 400, function() {
          if (callback) {
            callback();
          }
        });
      }, 400);
    }
  };
});