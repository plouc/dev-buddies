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


// sample scenario
setTimeout(function() {
  $('.nav .search-button a').trigger('focus');
  setTimeout(function() {
    $('.nav .search-button a').trigger('click');
  }, 400);
  setTimeout(function() {
    searchSimulator(app, searchRenderer, 'Douglas Crockford');
  }, 1400);
}, 2000);
