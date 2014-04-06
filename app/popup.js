var Reporter = (function () {

  var _Reporter = function(options) {
    this.server = options.server;
  };

  _Reporter.prototype = (function() {


    var _parseTrends = function(data) {
      var lastTrend = data.data[data.data.length-1][1];
      $('.progress').html('<div class="progress-bar" role="progressbar" aria-valuenow="'+lastTrend.s_quality+'%" aria-valuemin="0" aria-valuemax="100" style="width: '+lastTrend.s_quality+'%;">'+lastTrend.s_quality+'% sleep quality</div>');
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
      this.server.getData('trends', {range_duration: '7', range:'d',bucket_size:'d'}, _parseTrends);
    };

    var _startReporting = function(user) {
      $('h1').html('<img src="https://jawbone.com/'+user.image+'" />'+user.name);

      _getUserStats.call(this);
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

    return {
      init: function() {
        this.server.init(_startReporting.bind(this));
        _bindEvents.call(this);
        return this;
      }
    };
  }());

  return _Reporter;
})();
var reporter = new Reporter({
  server: new API()
}).init();
