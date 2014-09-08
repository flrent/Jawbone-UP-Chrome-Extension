// 'use strict';

var empty = true;
var recordingTabId = null;
var hardStopRecording = null;
var screenshot = null;
var lastTimeStamp = 0;
var basicHostURLS = {};
var needsAuthentication = false;



var events = [
  { name: 'OpenUrl' },
  { name: 'Click' },
  { name: 'Change' },
  { name: 'Comment' },
  { name: 'Submit' },
  { name: 'CheckPageTitle' }, // done
  { name: 'CheckPageLocation' },
  { name: 'CheckTextPresent' }, // done
  { name: 'CheckValue' },
  { name: 'CheckValueContains' },
  { name: 'CheckText' },
  { name: 'CheckHref' }, // done
  { name: 'CheckEnabled' },
  { name: 'CheckDisabled' },
  { name: 'CheckSelectValue' },
  { name: 'CheckSelectOptions' },
  { name: 'CheckImageSrc' },
  { name: 'PageLoad' },
  { name: 'ScreenShot' },
  { name: 'MouseDown' },
  { name: 'MouseUp' },
  { name: 'MouseDrag' },
  { name: 'MouseDrop' },
  { name: 'KeyPress' },
  { name: 'SendKey' },
  { name: 'InsertRandom' },
  { name: 'Hover' }
];

var capture = function (id, callback) {
  chrome.tabs.captureVisibleTab(null, {
    "format": "jpeg",
    quality: 70
  }, function (img) {
    callback(img);
  });
};

function saveRecordInStorage(recording, callback) {
  chrome.storage.local.get('records', function (value) {
    var records;
    if (value.records == undefined) records = [];
    else records = value.records;

    records.push(recording);

    chrome.storage.local.set({
      'records': records
    }, function () {
      chrome.storage.local.get('records', function (value) {
        if (callback) {
          callback();
        }
      });
    });
  });
};

function processSteps(rawSteps) {
  var steps = [];
  var lastInputKeyPressed = {
    selector: '',
    value: ''
  };
  var lastTimeStamp = null;
  console.log('Processing steps ');
  console.log(rawSteps);

  for (var i = 0; i < rawSteps.length; i++) {
    var step = rawSteps[i];
    // if step is on a restricted URL, ask credentials
    //

    if (basicHostURLS[step.url] !== undefined) {
      console.log('We detected a step on a basic auth restricted URL');
      needsAuthentication = true;
    }

    if(step.eventName.indexOf('Check')>-1) {
      console.log('its a check event');
      step.info.text= step.text;
    }
    if (step.hasOwnProperty('info')) {
      // this is an event triggered following user action (click, keypress..), not recorded (open page, ..)

      if (step.eventName == "KeyPress") {
        // if the event is a KeyPress, then log which # input is concerned and its value
        // so we can remove the change event related
        console.log('New keyPress on ' + step.info.selector + ' with value ' + step.text);

        step.randomize = false;
        step.randomType = 'word';

        lastInputKeyPressed = {
          value: step.text,
          selector: step.info.selector
        };

        var lastStep = steps[steps.length - 1];
        if ((lastStep.eventName == "Click" || lastStep.eventName == "MouseDown") && lastStep.info.selector == step.info.selector) {
          // if it's a keypress right after a click, it means that the user focused the input before talking, we don't need both
          steps.pop();
        }

        steps.push(step);
      } else if (step.eventName == "Change") {
        // if the change event is fired, we check if there is already a keypress event fired with the same value

        console.log('New Change on ' + step.info.selector + ' with value ' + step.info.value);

        if (step.info.selector != lastInputKeyPressed.selector && step.info.value != lastInputKeyPressed.value) {
          // steps.push(step);
          lastInputKeyPressed = {
            selector: '',
            value: ''
          };
        }


        // check if the change fired on a select
        if (step.info.tagName == "SELECT") {
          //remove the last click event if it's on the same select
          var lastStep = steps[steps.length - 1];
          if (lastStep.info.tagName == "SELECT" && lastStep.info.selector == step.info.selector) {
            steps.pop();
          }

          for(var o=0;o<step.info.options.length;o++) {
            if(step.info.options[o].value == step.info.value) {
              step.info.valueText = step.info.options[o].text;
              break;
            }
          }
          step.eventName = "Select";
          steps.push(step);
        }

      } else if (step.eventName == 'MouseDown') {
        step.eventName = 'Click';
        step.type = 1;
        steps.push(step);
      }
      else if (step.eventName == "Submit") {
        // IGNORED
      } else if (step.eventName == 'InsertRandom') {
        // to do as if it was a type
        step.randomize = false;
        step.eventName = 'KeyPress';
        step.type = 23;
        step.text = step.randomValue;

        if (step.randomType == 'email') {
          step.testEmailReceived = false;
        }
        steps.push(step);
      } else {
        // not a click event, so we keep it
        steps.push(step);
      }
    } else {
      if (step.hasOwnProperty('url')) {
        // first event recorded, context & url
        steps.push(step);
      }
    }

  }

  return steps;
}

function openNewTabWhileRecording() {

  chrome.notifications.clear('multitab', function () {
    chrome.notifications.create('multitab', {
      type: 'basic',
      title: 'BugBuster Scenario Recorder',
      message: 'BugBuster recorder does not support recording multiple tabs yet. Events happening in this tab won\'t be recorded.',
      iconUrl: '../images/icon-128.png',
      isClickable: true
    }, function () {});
  });
};

function switchTabWhileRecording(info) {
  if (info.tabId !== recordingTabId) {
    openNewTabWhileRecording();
  } else {
    chrome.notifications.clear('multitab', function () {});
  }
};

function afterCloseRecordingTab(tabId, info) {
  if (tabId == recordingTabId) {
    alert('The recording stopped as the recorded tab was closed.');
    hardStopRecording = true;
  }
};



chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
  if (sender.tab) {
    // console.log('Current tab recorded : '+ recordingTabId+'. Received a request from tab '+sender.tab.id+' for action '+request.action);
  }

  if (request.action == "append" && sender.tab.id == recordingTabId) {
    // append every user actions to the test recorder

    request.obj.eventName = events[request.obj.type].name;
    request.obj.url = sender.url.slice(0, sender.url.lastIndexOf('/'));
    steps[steps.length] = request.obj;
    empty = false;
    lastTimeStamp = request.obj.timestamp;
    console.log('New step ' + request.obj.eventName);
    console.log(request.obj);
    sendResponse({});
  } else if (request.action == "poke" && sender.tab.id == recordingTabId) {
    // used when filling an input to buffer all keys
    request.obj.eventName = events[request.obj.type].name;
    steps[steps.length - 1] = request.obj;
    sendResponse({});
  } else if (request.action == "startRecording") {
    if (!recorderActive) {
      recorderActive = true;
      empty = true;
      steps = new Array();
      recordingTabId = request.recorded_tab;

      chrome.tabs.onActivated.removeListener(switchTabWhileRecording);
      chrome.tabs.onRemoved.removeListener(afterCloseRecordingTab);
      chrome.tabs.onActivated.addListener(switchTabWhileRecording);
      chrome.tabs.onRemoved.addListener(afterCloseRecordingTab);
      chrome.tabs.sendMessage(recordingTabId, {
        action: "open",
        'url': request.start_url,
        screenshot: screenshot
      });

      var openUrlEvent = {
        eventName: "OpenUrl",
        height: null,
        timestamp: new Date()
          .getTime(),
        type: 0,
        url: request.start_url,
        width: null,
      };
      steps.push(openUrlEvent);

      analytics.track('recorder', 'start', request.start_url);

      chrome.tabs.update(recordingTabId, {
        url: request.start_url
      }, function (tab) {
        updateBadgeText({
          recorderActive: true
        });
      });

      sendResponse({
        startRecording: true
      });
    }
  } else if (request.action == "stopRecording") {
    recorderActive = false;
    chrome.tabs.sendMessage(recordingTabId, {
      action: "stopRecording"
    });

    capture(recordingTabId, function (screenshot) {
      var filteredSteps = processSteps(steps);
      var record = {
        needsAuthentication: needsAuthentication,
        date: new Date()
          .getTime(),
        name: "" + new Date()
          .toDateString() + ' at ' + new Date()
          .toLocaleTimeString(),
        screenshot: screenshot,
        steps: filteredSteps
      };

      chrome.tabs.onActivated.removeListener(switchTabWhileRecording);
      chrome.tabs.onRemoved.removeListener(afterCloseRecordingTab);

      hardStopRecording = false;
      saveRecordInStorage(record, function () {
        updateBadgeText({
          recorderActive: recorderActive,
          selectorActive: selectorActive
        });
        sendResponse(record);
      });
      analytics.track('recorder', 'stop', filteredSteps.length + 'steps on ' + (filteredSteps[0].url ? filteredSteps[0].url : ''));
    });
  } else if (request.action == "cancelRecording") {
      recorderActive = false;

      chrome.tabs.sendMessage(recordingTabId, {
        action: "stopRecording"
      });
      chrome.tabs.onActivated.removeListener(switchTabWhileRecording);
      chrome.tabs.onRemoved.removeListener(afterCloseRecordingTab);
      analytics.track('recorder', 'cancel', '');
      sendResponse();
  }
  else if (request.action == "get_items") {
    sendResponse({
      'items': steps
    });
  }

  return true;
});


chrome.webNavigation.onCommitted.addListener(function (details) {
  if (recordingTabId == details.tabId) {

    var actions = details.transitionQualifiers;
    for (var i = 0; i < actions.length; i++) {
      if (actions[i] == 'forward_back' || actions[i] == 'from_address_bar') {
        step = {
          eventName: 'OpenUrl',
          timestamp: details.timeStamp,
          type: 0,
          url: details.url
        };
        steps.push(step);
        console.log(details);
        break;
      }
    }
  }
});

// log into a hashmap every request made to a basic auth url
chrome.webRequest.onAuthRequired.addListener(function (details) {
  console.warn('Detected a basic auth URL ' + details.url);

  var url = details.url.slice(0, details.url.lastIndexOf('/'));
  basicHostURLS[url] = details;

}, {
  urls: ["<all_urls>"]
});
