/*
 * oauth2-chrome-extensions
 * <https://github.com/jjNford/oauth2-chrome-extensions>
 *
 * Copyright (C) 2012, JJ Ford (jj.n.ford@gmail.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * This is a streamlined version of Boris Smus solution (Aapache License v2.0).
 * <https://github.com/borismus/oauth2-extensions>
 *
 * <http://oauth.net/2/>
 *
 */

/* NOTE
 *
 * This was designed to work with the GitHub API v3. This source may need to be altered
 * to work with your providers API. However the method used to gain the OAuth2 token
 * should work if the code is correctly configured to the API being targeted.
 * Methods to update the token and save the expiration date may also need to be added.
 *
 */


//
//
// FILE MODIFIED By @flrent in order to make it work for Jawbone
//
//

var global = this;
(function() {

    global.oauth2 = {

        /**
         * Initialize
         */
        init: function() {
            this.KEY = credentials.KEY;
            this.ACCESS_TOKEN_URL = credentials.ACCESS_TOKEN_URL;
            this.AUTHORIZATION_URL = credentials.AUTHORIZATION_URL;
            this.CLIENT_ID = credentials.CLIENT_ID;
            this.CLIENT_SECRET = credentials.CLIENT_SECRET;
            this.REDIRECT_URL = credentials.REDIRECT_URL;
            this.SCOPES = credentials.SCOPES;

        },

        /**
         * Begin
         */
        begin: function() {
            var url = this.AUTHORIZATION_URL + "?response_type=code&client_id=" + this.CLIENT_ID + "&redirect_uri=" + this.REDIRECT_URL + "&scope=";

            for(var i in this.SCOPES) {
                url += this.SCOPES[i];
            }

            chrome.tabs.create({url: url, selected: true}, function(data) {
                chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                    return true;
                });
                return true;
            });
        },

        /**
         * Parses Access Code
         *
         * @param url The url containing the access code.
         */

        /**
         * Request Token
         *
         * @param code The access code returned by provider.
         */
        requestToken: function(code) {
            var that = this;
            var data = new FormData();
            data.append('client_id', this.CLIENT_ID);
            data.append('client_secret', this.CLIENT_SECRET);
            data.append('grant_type', 'authorization_code');
            data.append('code', code);

            var xhr = new XMLHttpRequest();
            xhr.addEventListener('readystatechange', function(event) {
                if(xhr.readyState == 4) {
                    if(xhr.status == 200) {
                        that.finish(JSON.parse(xhr.responseText));
                    }
                    else {
                        alert('error');
                        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                           chrome.tabs.remove(tabs[0].id, function(){});
                            return true;
                        });
                    }
                }
            });
            xhr.open('POST', this.ACCESS_TOKEN_URL, true);
            xhr.send(data);
        },

        /**
         * Finish
         *
         * @param token The OAuth2 token given to the application from the provider.
         */
        finish: function(oauth2Data) {
            chrome.storage.sync.set({'oauth2': oauth2Data}, function() {
              chrome.runtime.sendMessage({authorized: true}, function(){
                chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                   chrome.tabs.remove(tabs[0].id, function(){});
                    return true;
                });
              });
            });

        },

        /**
         * Get Token
         *
         * @return OAuth2 access token if it exists, null if not.
         */
        getToken: function() {
            try {
                return window['localStorage'][this.KEY];
            }
            catch(error) {
                return null;
            }
        },

        /**
         * Delete Token
         *
         * @return True if token is removed from localStorage, false if not.
         */
        deleteToken: function() {
            try {
                delete window['localStorage'][this.KEY];
                return true;
            }
            catch(error) {
                return false;
            }
        }
    };

    oauth2.init();

})();
