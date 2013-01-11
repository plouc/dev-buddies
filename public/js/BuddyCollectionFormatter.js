/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author    Raphaël Benitte
 * @constructor
 */
var BuddyCollectionFormatter = {
  format: function (buddies) {
    'use strict';

    buddies = _.values(buddies);
    buddies.sort(function compare(a, b) {
      if (a.id.toLowerCase() < b.id.toLowerCase()) {
        return -1;
      }
      if (a.id.toLowerCase() > b.id.toLowerCase()) {
        return 1;
      }
      return 0;
    });

    var formattedBuddies = [],
      currentLetter;

    _.each(buddies, function (buddy) {
      var buddyStartLetter = buddy.id.substr(0, 1).toLocaleUpperCase();
      if (!currentLetter || buddyStartLetter !== currentLetter.letter) {
        currentLetter = {
          letter:  buddyStartLetter,
          buddies: []
        };
        formattedBuddies.push(currentLetter);
      }
      buddy.pendingRemove = false;
      currentLetter.buddies.push(buddy);
    });

    return formattedBuddies;
  }
};