/**
 * (c) 2012-2013 Raphaël Benitte (http://rbenitte.com)
 */
$(document).ready(function () {
  "use strict";

  var app           = new App(),
    searchRenderer  = new SearchRenderer(app, '.search'),
    buddiesRenderer = new BuddiesRenderer($('#buddies-list')),
    buddyRenderer   = new BuddyRenderer($('buddy-profile')),
    $panelContainer = $('.panel-container'),
    storage         = new Storage(),
    $buddyProfile   = $('#buddy-profile');


  searchRenderer.init();
  buddiesRenderer.init();

  // buddies list bindings
  $(buddiesRenderer).on('buddy.details', function (e, profile) {
    _.each(profile.providerData, function (providerProfileData, providerName) {
      app.getProviderRenderer(providerName).render(providerProfileData.data);
      gotoPanel('#buddy-profile');
    });
  }).on('buddy.remove', function (e, $item, profile) {
    app.removeProfile(profile, function () {
      $item.fadeOut(200, function () {
        $item.remove();
      });
    });
  });


  $buddyProfile.find('.back-list').on('click', function (e) {
    e.preventDefault();
    gotoPanel('#buddies-list');
  });


  // home action buttons bindings
  $('#home .presentation a.go-search').on('click', function (e) {
    e.preventDefault();
    gotoPanel('#search', function () {
      searchRenderer.$query.focus();
    });
  });
  $('#home .presentation a.go-list').on('click', function (e) {
    e.preventDefault();
    gotoPanel('#buddies-list');
  });


  $(app).on('buddies.result', function (e, buddies) {
    buddiesRenderer.render(buddies);
  }).on('buddy.saved', function (e) {
    app.getBuddies();
  });


  // storage initialization
  storage.init(function () {
    app.setStorage(storage).getBuddies();
  });

  // nav buttons bindings
  $('.nav').on('click', 'a', function (e) {
    e.preventDefault();

    var $navButton  = $(this),
      panelSelector = $navButton.attr('href');

    gotoPanel(panelSelector);
    $('.nav a').removeClass('active');
    $navButton.addClass('active');
  });


  _.each(app.providers, function (provider, providerName) {
    $buddyProfile.find('.panel-wrapper').append(app.getProviderRenderer(providerName).getContainer());
  });


  $(searchRenderer).on('submit', function (e, query) {
    app.search(query, function (query, results) {
      searchRenderer.resultsLoaded().render(query, results);
    });
  }).on('build.init', function (e, query, results) {

    app.getUserProfile(query, results, function (profile) {

      searchRenderer.$mainOverlay.css('display', 'none');
      app.storeProfile(profile);

      _.each(profile.providerData, function (providerProfileData, providerName) {
        app.getProviderRenderer(providerName).render(providerProfileData.data);
      });

      gotoPanel('#buddy-profile');
    });
  });


  // generic bindings for switch components
  $('.switch').on('click', function (e) {
    var $switch = $(this);
    if ($switch.hasClass('on')) {
      $switch.removeClass('on').addClass('off');
    } else {
      $switch.removeClass('off').addClass('on');
    }
  });


  var gotoPanel = function (selector, callback) {

    var $panel  = $(selector),
      $subpanel = null,
      $subpanelContainer;

    if ($panel.hasClass('subpanel')) {
      $subpanel = $panel;
      $panel    = $subpanel.parents('.panel');
    }

    $panelContainer.animate({
      'left': '-' + ($panel.index() * 20) + '%'
    }, 400, function () {
      if ($subpanel === null && callback) {
        callback();
      }
    });

    if ($subpanel !== null) {
      $subpanelContainer = $panel.find('.subpanel-container');

      setTimeout(function () {
        $subpanelContainer.animate({
          'top': '-' + ($subpanel.index() * 100) + '%'
        }, 400, function () {
          if (callback) {
            callback();
          }
        });
      }, 400);
    }
  };
});