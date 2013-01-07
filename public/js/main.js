/**
 * (c) 2012-2013 Raphaël Benitte (http://rbenitte.com)
 */
$(document).ready(function () {
  "use strict";

  var app            = new App(),
    searchRenderer   = new SearchRenderer(app, '.search'),
    buddiesRenderer  = new BuddiesRenderer($('#buddies-list')),
    buddyRenderer    = new BuddyRenderer($('buddy-profile')),
    settingsRenderer = new SettingsRenderer($('#settings .panel-wrapper')),
    $panelContainer  = $('.panel-container'),
    storage          = new Storage(),
    $buddyProfile    = $('#buddy-profile');

  searchRenderer.init();
  buddiesRenderer.init();

  settingsRenderer.renderProviders(app.providers);

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


  // app bindings
  $(app).on('buddy.list', function (e, buddies) {
    buddiesRenderer.render(buddies);
  }).on('buddy.saved', function (e) {
    app.getBuddies();
  }).on('api.quota', function (e, providerId, quotaMax, quotaRemaining) {
    settingsRenderer.updateQuota(providerId, quotaMax, quotaRemaining);
  }).on('buddy.profile', function (e, profile) {
    searchRenderer.$mainOverlay.css('display', 'none');
    _.each(profile.providerData, function (providerProfileData, providerId) {
      app.getProviderRenderer(providerId).render(providerProfileData.data);
    });
    gotoPanel('#buddy-profile');
  });


  // storage initialization
  storage.init(function () {
    app.setStorage(storage).getBuddies();
    storage.getAll('quota', function (quotas) {
      _.each(quotas, function (quota, providerId) {
        settingsRenderer.updateQuota(providerId, quota.max, quota.remaining);
      });
    });
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
    app.getUserProfile(query, results);
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


  var $popin        = $('#popin'),
    $popinTitle     = $popin.find('.title'),
    $popinContainer = $popin.find('.container'),
    $popinClose     = $popin.find('.close'),
    setPopinContent,
    closePopin;

  $popinClose.on('click', function (e) {
    closePopin();
  });

  setPopinContent = function (title, content) {
    $popinTitle.html(title);
    $popinContainer.html(content);
    $popin.css('display', 'block');
  };

  closePopin = function () {
    $popin.css('display', 'none');
  };

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