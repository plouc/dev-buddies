/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @param selector
 * @constructor
 */
var SearchRenderer = function(app, selector) {

  this.app = app;

  this.$container       = $(selector);
  this.$query           = this.$container.find('input[name="search"]');
  this.$clearQuery      = this.$container.find('.clear');
  this.$submit          = this.$container.find('a');
  this.$toggle          = this.$container.find('.toggle');
  this.$overlay         = this.$container.find('.overlay');
  this.$results         = $('#search .results');
  this.$selectedResults = $('#search .selected-results');
  this.$notice          = $('#search .notice');
  this.$build           = $('#search .build');
  this.$mainOverlay     = $('#search > .overlay');

  this.searchId        = null;
  this.selectedResults = {};
};

/**
 *
 * @return {*}
 */
SearchRenderer.prototype.init = function() {

  var self = this;

  this.$query.on('keyup', function(e) {
    if (self.$query.val().length > 0) {
      self.$clearQuery.css('display', 'block');
    } else {
      self.$clearQuery.css('display', 'none');
    }
  });

  this.$clearQuery.on('click', function(e) {
    self.$query.val('').focus();
    self.$clearQuery.css('display', 'none');
  });

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

  this.$build.find('a').on('click', function(e) {
    e.preventDefault();
    self.$mainOverlay.css('display', 'block');
    $(self).trigger('build.init', [self.searchId, self.selectedResults]);
  });

  return this;
};

/**
 *
 * @return {SearchRenderer}
 */
SearchRenderer.prototype.resultsLoaded = function() {

  this.$overlay.css('display', 'none');
  this.$container.addClass('closed');
  this.$build.css('display', 'none');

  return this;
};

/**
 *
 * @param {String} searchId
 * @param results
 */
SearchRenderer.prototype.render = function(searchId, results) {

  this.searchId = searchId;

  this.$results.html('');
  this.$selectedResults.html('');
  this.$build.css('display', 'none');

  if (results.length > 0) {
    var self = this;

    this.$notice.css('display', 'block');

    var providers = this.app.getProviderNames();
    providers.forEach(function(provider) {
      providers[provider] = 0;
    });

    results.forEach(function(result) {

      var resultId = result.providerName + '-result-' + providers[result.providerName];

      var resultContent = '<li';
      resultContent += ' id="' + resultId + '"';
      resultContent += ' class="provider-' + result.providerName;
      if (result.picture !== null) {
        resultContent += ' has-picture">';
        resultContent += '<img src="' + result.picture + '" alt="' + result.fullname + '"/>';
      } else {
        resultContent += ' no-picture">';
      }
      resultContent += '<h2>' + result.fullname + '</h2>';
      resultContent += '<p>' + result.description + '</p>';
      resultContent += '<span class="validate"></span>';
      resultContent += '</li>';

      var $result = $(resultContent);

      $result.click(function(e) {
        self.addSelectedResult(resultId, result);
        $result.css('display', 'none');
      });

      self.$results.append($result);

      providers[result.providerName]++;
    });
  }

  return this;
};

/**
 *
 * @param {String} resultId
 * @param {Object} result
 * @return {SearchRenderer}
 */
SearchRenderer.prototype.addSelectedResult = function(resultId, result) {

  this.selectedResults[resultId] = result;

  var resultContent = '<li';
  resultContent += ' id="' + resultId + '"';
  resultContent += ' class="provider-' + result.providerName;
  if (result.picture !== null) {
    resultContent += ' has-picture">';
    resultContent += '<img src="' + result.picture + '" alt="' + result.fullname + '"/>';
  } else {
    resultContent += ' no-picture">';
  }
  resultContent += '<h2>' + result.fullname + '</h2>';
  resultContent += '<p>' + result.description + '</p>';
  resultContent += '<a href="#" class="validate"></a>';
  resultContent += '</li>';

  var $result = $(resultContent);

  this.$selectedResults.append($result);
  this.$build.css('display', 'block');

  return this;
};