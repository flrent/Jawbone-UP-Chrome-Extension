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
