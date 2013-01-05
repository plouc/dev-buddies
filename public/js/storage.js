/**
 * @copyright 2012-2013 Raphaël Benitte (http://rbenitte.com)
 * @constructor
 */
var Storage = function() {

  this.indexedDb         = window.indexedDB||window.webkitIndexedDB||window.mozIndexedDB||window.oIndexedDB||window.msIndexedDB;
  this.indexedDbKeyRange = window.IDBKeyRange||window.webkitIDBKeyRange;
  this.dbName            = 'buddies';
  this.dbVersion         = '1.0';
  this.db                = null;
};

/**
 * Initialization
 *
 * @param {Function} callback
 */
Storage.prototype.init = function(callback) {

  var self = this;

  var request = this.indexedDb.open(this.dbName);

  request.onsuccess = function(e) {

    self.db = e.target.result;

    if (self.dbVersion != self.db.version) {
      var upgradeRequest = self.db.setVersion(v);
      upgradeRequest.onfailure = function(error) {
        console.log('Error while setting DB version', error);
      };
      upgradeRequest.onsuccess = function(e) {
        var store = self.db.createObjectStore("buddies", {
          "keyPath": "id"
        });
        e.target.transaction.oncomplete = function() {
          callback();
        };
      };
    } else {
      callback();
    }
  };

  return this;
};

/**
 *
 * @param {String} storeName
 * @param value
 * @param {Function} callback
 */
Storage.prototype.store = function(storeName, value, callback) {

  var self = this;

  var trans   = this.db.transaction([storeName], "readwrite")
    , store   = trans.objectStore(storeName)
    , request = store.put(value);

  request.onsuccess = function(e) {
    console.log('success', e);
  };

  request.onerror = function(e) {
    console.log('error', e);
  };
};

/**
 *
 * @param {String} storeName
 * @param {Function} callback
 */
Storage.prototype.dumpStore = function(storeName, callback) {

  var trans         = this.db.transaction([storeName], "readwrite")
    , store         = trans.objectStore(storeName)
    , keyRange      = this.indexedDbKeyRange.lowerBound(0)
    , cursorRequest = store.openCursor(keyRange)
    , results       = [];

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;
    if (!!result == false) {
      callback(results);
      return;
    }

    results.push(result.value);
    result['continue']();
  };

  cursorRequest.onerror = function(error) {
    console.log('Storage error while reading store ' + storeName, error);
  };
};
