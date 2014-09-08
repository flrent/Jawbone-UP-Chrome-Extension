angular.module('recorder.services')
  .service('Storage', ['$rootScope', function($rootScope) {

    /******************************************************************************/
    /****************************** Initialization ********************************/
    /******************************************************************************/

    var _Storage = {
      records: [],
      selectors: []
    };

    loadRecords();

    /**
     * Initialization of records
     */
    function loadRecords(){
      chrome.storage.local.get('records', function(value) {
        _loadRecords(value.records);
        loadSelectors();
      });

    }

    /**
     * Internal use, reuses code
     * @param records
     * @private
     */
    function _loadRecords(records){
      _Storage.records = records;
      $rootScope.$broadcast('recordsChanged', _Storage.records);
    }

    /**
     * Initialization of selectors
     */
    function loadSelectors() {
      chrome.storage.local.get('selectors', function(data) {
        _loadSelectors(data.selectors);
      });
    }

    /**
     * Internal use, reuses code
     * @param selectors
     * @private
     */
    function _loadSelectors(selectors) {
      _Storage.selectors = selectors;
      $rootScope.$broadcast('selectorsChanged', _Storage.selectors);
    }

    /******************************************************************************/
    /************************** External API for records **************************/
    /******************************************************************************/

    /**
     * Soft deletion for all records
     */
    var removeAllRecords = function() {
      _Storage.records.forEach(function(record){
        record.deleted = true;
      });

      chrome.storage.local.set({'records': _Storage.records});
    };

    /**
     * Soft deletion for a given record
     * @param record
     * @param callback {function}
     */
    var removeRecord = function(record, callback) {
      toggleRecordDeletion(record, true, callback);
    };

    /**
     * Retrieve a soft deleted record
     * @param record
     * @param callback {function}
     */
    var recoverRecord = function(record, callback) {
      toggleRecordDeletion(record, false, callback);
    };

    /**
     * Toggles soft deletion flag for a record
     * @param record
     * @param value
     * @param callback {function}
     */
    var toggleRecordDeletion = function (record, value, callback){
      var records = _Storage.records;

      for (var i in records){
        var rec = records[i];

        if (rec.date == record.date ){
          rec.deleted = value;
          break;
        }
      }

      chrome.storage.local.set({'records': records}, function(){
        if (typeof callback == 'function'){
          callback();
        }
      });
    };

    /**
     * Soft deletion for a given step of a given record
     * @param record
     * @param step
     * @param callback {function}
     */
    var removeStep = function(record, step, callback) {
      toggleStepDeletion(record, step, true, callback);
    };

    /**
     * Retrieves a soft deleted step from a given record
     * @param record
     * @param step
     * @param callback {function}
     */
    var recoverStep = function(record, step, callback) {
      toggleStepDeletion(record, step, false, callback);
    };

    /**
     * Toggles soft deletion flag for a step in a given record
     * @param record
     * @param step
     * @param value
     * @param callback {function}
     */
    var toggleStepDeletion = function(record, step, value, callback){

      // @HACK: to avoid a nasty race condition, wait until data is retrieved from storage
      //        otherwise, only the first record changed will be persisted
      chrome.storage.local.get('records', function(data) {
        var records = _Storage.records;

        for (var i in records) {
          var rec = records[i];

          if (rec.date == record.date) {

            var steps = rec.steps;

            for (var j in steps) {
              var stp = steps[j];

              if (stp.timestamp == step.timestamp) {
                stp.deleted = value;
                break;
              }
            }

            break;
          }
        }

        chrome.storage.local.set({'records': records}, function(){
          if (typeof callback == 'function'){
            callback();
          }
        });
      });
    }

    /**
     * Logic that removes all records and steps marked as soft deleted
     */
    var purgeDeleted = function(){
      chrome.storage.local.get('records', function(value) {
        if (!value.records) {
          return;
        }

        value.records.forEach(function(record){
          if (record.deleted) {
            hardRemoveRecord(record);
          }
          else {
            if (record.steps) {
              record.steps.forEach(function(step){
                if (step.deleted){
                  hardRemoveStep(record, step);
                }
              });
            }
          }
        });

        console.log('new records', _Storage.records);

        chrome.storage.local.set({records: _Storage.records});
      });
    };

    /**
     * Removes a given record (hard delete)
     * @param record
     */
    var hardRemoveRecord = function(record){
      var newArray = [];

      _Storage.records.forEach(function(rec){
        if (rec.date !== record.date){
          newArray.push(rec);
        }
      });

      _Storage.records = newArray;
    };

    /**
     * Removes a given step of a given record (hard delete)
     * @param record
     * @param step
     */
    var hardRemoveStep = function(record, step){

      var records = _Storage.records;

      record.steps = _.without(record.steps, step);

      for (var i in records) {
        var rec = records[i];
        if (rec.date === record.date){
          rec.steps = record.steps;
          break;
        }
      };

    };


    var checkRandomStep = function(record, step, callback) {
      toggleCheckRandomStep(record, step, !step.randomize, callback);
    };

    /**
     * Toggles check random for text
     * @param record
     * @param step
     * @param value
     * @param callback {function}
     */
    var toggleCheckRandomStep = function (record, step, value, callback){
      var records = _Storage.records;

      for (var i in records){
        var rec = records[i];

        if (rec.date == record.date){
          // we found the right record
          var steps = rec.steps; // copy of the steps object

          for(var j = 0;j<steps.length;j++) {
            //let's loop to find the right step
            var s = steps[j];

            if(s.timestamp==step.timestamp) {
              // we found the right step to check or uncheck

              if(s.randomType=='email' && s.testEmailReceived) {
                s.randomize = true;
              }
              else {
                s.randomize = value;
              }
              rec.steps = steps;

              chrome.storage.local.set({'records': records}, function(){
                if (typeof callback == 'function'){
                  callback();
                }
              });

              break;
            }

          }
          break;
        }
      }
    };


    var testEmailReceived = function(record, step, callback) {
      toggleTestEmailReceived(record, step, !step.testEmailReceived, callback);
    };
    /**
     * Toggles adding a new assertion to test if email is received
     * @param record
     * @param step
     * @param value
     * @param callback {function}
     */
    var toggleTestEmailReceived = function (record, step, value, callback){
      var records = _Storage.records;

      for (var i in records){
        var rec = records[i];

        if (rec.date == record.date){
          // we found the right record
          var steps = rec.steps; // copy of the steps object

          for(var j = 0;j<steps.length;j++) {
            //let's loop to find the right step
            var s = steps[j];

            if(s.timestamp==step.timestamp) {
              // we found the right step to check or uncheck
              s.testEmailReceived = value;
              if(value) s.randomize = true;
              rec.steps = steps;


              chrome.storage.local.set({'records': records}, function(){
                if (typeof callback == 'function'){
                  callback();
                }
              });

              break;
            }

          }
          break;
        }
      }
    };


    var saveTextEdition = function(record, step, value, callback) {
      var records = _Storage.records;

      for (var i in records){
        var rec = records[i];

        if (rec.date == record.date){
          // we found the right record
          var steps = rec.steps; // copy of the steps object

          for(var j = 0;j<steps.length;j++) {
            //let's loop to find the right step
            var s = steps[j];

            if(s.timestamp==step.timestamp) {
              // we found the right step to check or uncheck
              s.text = value;
              rec.steps = steps;

              chrome.storage.local.set({'records': records}, function(){
                if (typeof callback == 'function'){
                  callback();
                }
              });

              break;
            }

          }
          break;
        }
      }
    };


    var saveSelectOption = function(record, step, value, callback) {
      var records = _Storage.records;

      for (var i in records){
        var rec = records[i];

        if (rec.date == record.date){
          // we found the right record
          var steps = rec.steps; // copy of the steps object

          for(var j = 0;j<steps.length;j++) {
            //let's loop to find the right step
            var s = steps[j];

            if(s.timestamp==step.timestamp) {
              // we found the right step to check or uncheck
              s.info.value = value;
              for(var o=0;o<s.info.options.length;o++) {

                if(s.info.options[o].value == value) {
                  s.info.valueText = s.info.options[o].text;
                  break;
                }

              }
              rec.steps = steps;

              chrome.storage.local.set({'records': records}, function(){
                if (typeof callback == 'function'){
                  callback();
                }
              });
              break;
            }

          }
          break;
        }
      }
    };

    /**
     * Updates records and selectors when they change in storage
     */
    chrome.storage.onChanged.addListener(function(changes, namespace) {
      // records
      if(typeof (changes.records) == "object") {
        var storageChange = changes["records"];
        _loadRecords(storageChange.newValue);
      }
      // selectors
      if(typeof (changes.selectors) == "object") {
        var storageChange = changes["selectors"];
        _loadSelectors(storageChange.newValue);
      }
    });

    /******************************************************************************/
    /************************* External API for selectors *************************/
    /******************************************************************************/

    var removeAllSelectors = function() {
      chrome.storage.local.clear(function() {});
    };

    var removeSelector = function(selector) {
      var newArray = _.without(_Storage.selectors, selector);

      chrome.storage.local.set({'selectors': newArray}, function() {
        console.log('Removed');
      });

    };


    function saveLastProjectExported(id) {
      chrome.storage.local.get('settings', function(data) {
        if(data.settings) {
          var s = data.settings;
          s.lastProjectId = id;
          chrome.storage.local.set({'settings': s}, function() {
            console.log('Settings: last project id saved');
          });
        }
      });
    };
    /******************************************************************************/
    /***************************** External Interface *****************************/
    /******************************************************************************/

    return {
      saveTextEdition: saveTextEdition,
      saveSelectOption: saveSelectOption,
      checkRandomStep: checkRandomStep,
      testEmailReceived: testEmailReceived,
      removeRecord: removeRecord,
      recoverRecord: recoverRecord,
      removeAllRecords: removeAllRecords,
      removeStep: removeStep,
      recoverStep: recoverStep,
      removeSelector: removeSelector,
      removeAllSelectors: removeAllSelectors,
      purgeDeleted: purgeDeleted,
      saveLastProjectExported: saveLastProjectExported
    };
  }]);
