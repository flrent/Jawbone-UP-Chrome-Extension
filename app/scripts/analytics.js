/**
 * Analytics BugBuster module
 */
var Analytics = (function (global) {

  var _Analytics = function(options) {
    this.trackerDomId = 'tracker';
  };

  _Analytics.prototype = (function(global) {

    var _logger = function(msg) {
      // @if DEBUG
        console.log('Analytics: '+new Date().toLocaleTimeString()+ ' : '+msg);
      // @endif
    };

    var _insertTracker = function() {
        // insert Google Analytics. Switch to any other easily
        var ga = document.createElement('script');
          ga.setAttribute('id', this.trackerDomId);
          ga.type = 'text/javascript';
          ga.async = true;
          ga.src = 'https://ssl.google-analytics.com/ga.js';

        var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(ga, s);

        global._gaq = global._gaq || [];
        global._gaq.push(['_setAccount', '']);
        global._gaq.push(['_trackPageview']);

        _logger('Tracker inserted into the DOM.');
    };

    var _destroyTracker = function() {
        var tracker = document.getElementById(this.trackerDomId);

        if(tracker!==undefined) {
          tracker.remove();
          global._gaq = null;
          _logger('Tracker destroyed.');
        }
    };

    var _trackEvent = function(category, action, label) {
        _logger('Tracking event '+category+' / '+ action+ ' / '+ label);
        global._gaq.push(['_trackEvent', category, action, label]);

        return true;
    };

    var _instance = null;
    return {
      track: function(category, action, label) {
        return _trackEvent(category, action, label);
      },
      init: function() {
        if(_instance==null) {
          _logger('Init called.');
          _insertTracker.call(this);
          _instance = this;
        }
        return _instance;
      },
      getTracker: function() {
        return document.querySelector('#'+this.trackerDomId);
      },
      destroy: function() {
        return _destroyTracker.call(this);
      }
    };
  }(global));

  return _Analytics;
})(window);
