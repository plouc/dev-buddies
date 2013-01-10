/**
 * (c) 2012-2013 Raphaël Benitte (http://rbenitte.com)
 */
$(document).ready(function () {
  "use strict";

  var app            = new App(),
    $panelContainer  = $('.panel-container'),
    storage          = new Storage(),
    $buddyProfile    = $('#buddy-profile');


  $buddyProfile.find('.back-list').on('click', function (e) {
    e.preventDefault();
  });


  // home action buttons bindings
  $('#home .presentation a.go-search').on('click', function (e) {
    e.preventDefault();
  });
  $('#home .presentation a.go-list').on('click', function (e) {
    e.preventDefault();
  });


  // app bindings
  $(app).on('buddy.list', function (e, buddies) {
    //buddiesRenderer.render(buddies);
  }).on('buddy.saved', function (e) {
    app.getBuddies();
  }).on('buddy.profile', function (e, profile) {
    _.each(profile.providerData, function (providerProfileData, providerId) {
      app.getProviderRenderer(providerId).render(providerProfileData.data);
    });
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

    $('.nav a').removeClass('active');
    $navButton.addClass('active');
  });


  _.each(app.providers, function (provider, providerName) {
    $buddyProfile.find('.panel-wrapper').append(app.getProviderRenderer(providerName).getContainer());
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
});