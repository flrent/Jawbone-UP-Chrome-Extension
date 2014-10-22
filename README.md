<<<<<<< HEAD
Jawbone-UP-chrome
=================

Google Chrome Extension for seeing Jawbone UP stats in the browser

## Features
Currently supports distance by day, sleep and quality of sleep.
Now that the extension is powered by Angular, more stats will be added with better graphs.

Feel free to submit PR.

### Download it on the [Chrome Web Store](https://chrome.google.com/webstore/detail/jawbone-up-chrome-extensi/imjkegdfgajgdbgeondmlgddalgeefij)

![Screenshot](http://i.imgur.com/wmGMF4b.png)
=======
## BugBuster Recorder

### Installation for development
- Launch ``npm install && bower install``
- Launch a ``grunt dev`` to build the templates

##### Use the dev version
- Clone the repo and go to [chrome://extensions](http://chrome://extensions)
- Click on `Load an unpacked extension`
- Select the `app` folder of this repo

##### Use the production version
- Launch `grunt build`
- Click on `Load an unpacked extension`
- Select the `dist` folder of this repo


### Create a distribution file (.CRX)
- Build the app with ``grunt build``
- In [chrome://extensions](http://chrome://extensions) click on ``Pack extension``
- Select the ``dist`` folder of your repo
- Use the ``app.pem`` key file
>>>>>>> 7131a1900d66bda3a69afc36788ca9df98ead0f2
