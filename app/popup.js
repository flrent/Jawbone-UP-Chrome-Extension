var Reporter = (function () {

  var _Reporter = function(options) {
    this.server = options.server;
  };

  _Reporter.prototype = (function() {

    var user = {};
    var _parseTrends = function(data) {
      _.each(data.data, function(day, index, list) {
        var data = day[1];
        var stats = {
          day: moment(day[0], "YYYYMMDD").format('MM/DD'),
          walked: data.m_distance/1000,
          s_quality: data.s_quality
        };
        $('.trends').append(Handlebars.templates.trends(stats));
      });
      $('.progress-bar').addClass('progress-bar-success');
    };

    var _getUserStats = function() {
      // this.server.getData('goals', {}, function(data) {
      //   $('body').append(data.sleep_total/60/60);
      //   $('body').append('<pre>'+JSON.stringify(data)+'</pre>');
      // });
      // this.server.getData('sleeps', {}, function(data) {
      //   $('body').append('<pre>'+JSON.stringify(data)+'</pre>');
      // });
    };

    var _startReporting = function(user) {
      $('h1').html('<img src="https://jawbone.com/'+user.image+'" />'+user.name);

      _getData.call(this);
    };


    var _bindEvents = function() {
      $('#close').on('click', function() {
        window.close();
      });
      $('#clear').on('click', function() {
        chrome.storage.sync.clear(function() {
         window.close();
        });
      });
      $('#contribute').on('click', function() {
        chrome.tabs.create({url: 'https://github.com/flrent/Jawbone-UP-Chrome-Extension'}, function(){});
      });
    };

    var _getData = function(callback) {
      var that = this;
     $.getJSON('https://jawbone.com/nudge/api/users/@me/trends',{range_duration: '7', range:'d',bucket_size:'d'}, function(data) {
        _parseTrends.call(that, data.data)
      });
    };


    var _authenticate = function(callback) {
      chrome.runtime.sendMessage({action:'oauth2.begin'}, function(response) {

        callback(response);
      });
    };

    return {
      init: function() {
        // this.server.init();
          _authenticate(_startReporting.bind(this));

        _bindEvents.call(this);
        return this;
      }
    };
  }());

  return _Reporter;
})();
var reporter = new Reporter({
  // server: new API().init()
}).init();
