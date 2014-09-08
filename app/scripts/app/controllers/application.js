angular.module('recorder.controllers')

/**
 * Application Controller handles all the layout actions and application general status
 */
.controller('ApplicationController',
  ['Storage', 'Api', '$scope', '$location',
    function(Storage, Api, $scope, $location) {

      $scope.validApiKey = false;
      $scope.apiKeyChecked = false;

      var tenants={};

      var parseTenants = function(t, cb) {
        for(var i=0;i<t.length;i++) {
          tenants[t[i].tenantID] = t[i].company;
        }
        cb(tenants);
      };

      $scope.checkApiKey = function(){
        $scope.apiKeyChecked = false;
        Api.checkApiKey(
          function(){
            Api.getTenants(function(t) {
              parseTenants(t.tenant, function(t) {
                $scope.tenants = t;
                $scope.validApiKey = true;
                $scope.apiKeyChecked = true;
              })
            })
          },
          function(){
            $scope.validApiKey = false;
            $scope.apiKeyChecked = true;
          }
        );
      };

      $scope.setApiKeyChecked = function(value){
        $scope.apiKeyChecked = !!value;
      }

      // start by initializing!
      $scope.checkApiKey();

      $scope.$on('recordsChanged', function (evt, records) {
        $scope.$apply(function() {
          $scope.records = records;
        });
      });

      $scope.$on('selectorsChanged', function (evt, selectors) {
        $scope.$apply(function() {
          $scope.selectors = selectors;
        });
      });

      $scope.discoverBB = function() {
        chrome.tabs.create({url:'http://bugbuster.com/l_chrome_extension/'}, function() {});
      };

      $scope.reportIssue = function() {
        chrome.tabs.create({url:'http://support.bugbuster.com'}, function() {});
      };

      $scope.goToBugBusterApp = function() {
        chrome.storage.local.get('settings', function(r){
          if(r.settings && r.settings.base_url) {
            chrome.tabs.create({url: r.settings.base_url}, function() {});
          }
          else {
            chrome.tabs.create({url:'https://app.bugbuster.com'}, function() {});
          }
        });
      };
      $scope.goToBugBusterAppCreate = function() {
        chrome.storage.local.get('settings', function(r){
          if(r.settings && r.settings.base_url) {
            chrome.tabs.create({url: r.settings.base_url+'/signup.html'}, function() {});
          }
          else {
            chrome.tabs.create({url:'https://app.bugbuster.com/signup.html'}, function() {});
          }
        });
      };

      $scope.disabled = false;
      $scope.isRecording = false;
      $scope.isSelecting = false;
      $scope.storage = Storage;

      $scope.startRecording = function() {
        console.log('start recording');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          console.log('sending message to tab ID:', tabs[0].id);
          chrome.runtime.sendMessage({action:'startRecording', recorded_tab: tabs[0].id, start_url: tabs[0].url});

          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            getStatus(tabs);
          });
        });
      };

      $scope.stopRecording = function() {

        chrome.runtime.sendMessage({action:'stopRecording'}, function(record) {

          $scope.isRecording = false;
          $scope.$apply(function(){
            $location.path('/records/'+record.date+'/details');
          });

        });
      };

      $scope.cancelRecording = function() {
        chrome.runtime.sendMessage({action:'cancelRecording'}, function(record) {
          $scope.isRecording = false;
          $scope.$apply(function(){
            $location.path('/');
          });

        });
      };

      $scope.startSelecting = function() {
        chrome.runtime.sendMessage({action: "startSelection"}, function(response) {
          $scope.isSelecting = true;
          window.close();
        });
      };

      $scope.stopSelecting = function() {
        chrome.runtime.sendMessage({action: "stopSelection"}, function(response) {
          $scope.isSelecting = false;
          $scope.$apply(function(){
            $location.path('/selectors');
          });
        });
      };

      $scope.close = function() {
        window.close();
      };


      $scope.switchToRecordingTab = function() {
        if($scope.recordingTabId) {
          chrome.tabs.get($scope.recordingTabId, function() {
            if(!chrome.runtime.lastError) {
              chrome.tabs.update($scope.recordingTabId, {selected: true});
            }
            else {
              $scope.stopRecording();
            }
          });
        }
      };
      $scope.switchToSelectingTab = function() {
        if($scope.selectingTabId) {
          chrome.tabs.update($scope.selectingTabId, {selected: true});
        }
      };



      var getStatus = function(tabs) {

        chrome.runtime.sendMessage({action: "getStatus", forTabId: tabs[0].id}, function(response) {
          if(response.hardStopRecording) {
             $scope.stopRecording();
          }
          else {
            $scope.isRecording = response.recorderActive;
            $scope.isRecordingCurrentTab = response.isRecordingCurrentTab;
            $scope.recordingTabId = response.recordingTabId;

            $scope.isSelecting = response.selectorActive;
            $scope.selectingTabId = response.selectingTabId;
            $scope.isSelectingCurrentTab = response.isSelectingCurrentTab;

            chrome.tabs.query({active:true, currentWindow: true}, function(tabs) {
              chrome.cookies.getAll({url: tabs[0].url}, function(c){
                $scope.cookiesLength = c.length;
                $scope.$apply();
              });
            });
            $scope.$apply();

            updateBadgeText({
              recorderActive: response.recorderActive,
              selectorActive: response.selectorActive,
            });
          }
        });
        $scope.storage.purgeDeleted();
      };


      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var isChromeInternalPage = /chrome:/;
        var isChromeWebStore = /chrome.google.com\/webstore/;

        if(isChromeInternalPage.test(tabs[0].url) || isChromeWebStore.test(tabs[0].url)) {
          $scope.disabled = true;
          $scope.$apply();
        }
        else {
          getStatus(tabs);
        }


      });

    }
  ]
);

/**
 * General purpose function
 * @param $scope
 * @param $stateParams
 */
function loadRecord($scope, $stateParams) {
  chrome.storage.local.get('records', function(data){
    if (data.records){
      data.records.forEach(function(record){
        if(record.date == $stateParams.date){
          $scope.record = record;
          $scope.$apply();
        }
      })
    }
  });
}
