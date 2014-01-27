Leap Sound
=========

Control your OSX volume using circle gestures on leapmotion controller


Installation
--------------

```sh
npm install
```

This library outputs notifications with growl, if you dont have growl installed on your system just comment out the growl references on index.js

To run the app
---------------

```sh
node app
```

Make it run on OSX startup
---------------

```sh
chmox +x index.js
```
Then make an Automator app that will run this script on OSX startup.

Author:
Gabriel Baciu

