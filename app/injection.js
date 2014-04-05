var url = window.location.href;
var params = url.substring(url.indexOf('?'));

chrome.runtime.sendMessage({action:'oauth2.codeReceived', code: params.slice(6, params.length)}, function(response) {
  console.log(response);
  return true;
});
