/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @author    Raphaël Benitte
 * @constructor
 */
var Storage = function () {
  'use strict';
};

/**
 * Initialization
 *
 * @param {Function} callback
 */
Storage.prototype.init = function (callback) {
  'use strict';
  if (_.isFunction(callback)) {
    callback();
  }
};

/**
 *
 * @param {String} collectionName
 * @param {String} key
 * @param value
 * @param {Function} callback
 */
Storage.prototype.set = function (collectionName, key, value, callback) {
  'use strict';

  var collection = localStorage.getItem(collectionName);
  if (collection === null) {
    console.log('Creating new collection');
    collection = {};
  } else {
    collection = JSON.parse(collection);
    console.log('Fetched existing collection', collection);
  }

  collection[key] = value;

  localStorage.setItem(collectionName, JSON.stringify(collection));

  if (_.isFunction(callback)) {
    callback();
  }
};

/**
 *
 * @param {String}   collectionName
 * @param {Function} callback
 */
Storage.prototype.getAll = function (collectionName, callback) {
  'use strict';

  var collection = localStorage.getItem(collectionName);
  if (collection === null) {
    console.log('No collection named ' + collectionName);
    collection = {};
  } else {
    collection = JSON.parse(collection);
    console.log('Fetched existing collection ' + collectionName, collection);
  }

  if (_.isFunction(callback)) {
    callback(collection);
  }
};

/**
 * @param {String}   collectionName
 * @param {String}   key
 * @param {Function} callback
 */
Storage.prototype.remove = function (collectionName, key, callback) {
  'use strict';

  var collection = localStorage.getItem(collectionName);
  if (collection === null) {
    console.log('Creating new collection');
    collection = {};
  } else {
    collection = JSON.parse(collection);
    console.log('Fetched existing collection', collection);
  }

  console.log('Delete entry from ' + collectionName + ' with id ' + key);
  delete collection[key];

  localStorage.setItem(collectionName, JSON.stringify(collection));

  if (_.isFunction(callback)) {
    callback();
  }
};