# simple-itach.js

A simple, unofficial and unsupported, node.js module for sending ir commands to Global Caché's iTach devices.

Tested on iTach IP2IR (PoE model).

There seems to be some other iTach modules already available on npm, you might want to check them out as well.

## Installation

```
npm install https://github.com/wafflegolfing/simple-itach.git
```

## Usage

Require the simple-itach library
```
var Itach = require('simple-itach');
```

Initiate a new Itach object with ip of iTach device
```
var itach = new Itach(ip);
```

Then use the send method (read below) to send commands.

### send(commands, callback)

Send command(s) to the iTach device.

##### Arguments

* commands

The command(s) to send, either a string or an array with strings as elements for multiple commands. The commands will be executed in order. Array elements, excluding the first, can also be integers to add delays (in milliseconds) between the commands.

* callback(error, result)

Result is an array with the responses from the itach device. Responses from the itach device that indicates command errors will not be in the error argument, but in the result array.

##### Examples

###### Send single command

```javascript
var Itach = require('simple-itach');
var itach = new Itach('192.168.0.123');
var lgPlasmaPwrToggle = 'sendir,1:3,1,38226,1,1,343,171,21,22,21,22,21,65,21,22,21,22,21,22,21,22,21,22,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,65,21,22,21,22,21,22,21,65,21,22,21,22,21,22,21,22,21,65,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,3822\r';
itach.send(lgPlasmaPwrToggle, function (err, res) {
  if (err) {
    console.log(err);
  } else {
    console.log(res);
  }
});
```

###### Send multiple commands

```javascript
var Itach = require('simple-itach');
var itach = new Itach('192.168.0.123');
var lgPlasmaPwrToggle = 'sendir,1:3,1,38226,1,1,343,171,21,22,21,22,21,65,21,22,21,22,21,22,21,22,21,22,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,65,21,22,21,22,21,22,21,65,21,22,21,22,21,22,21,22,21,65,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,3822\r';
var cmd = [
  lgPlasmaPwrToggle, // send command
  20000, // wait 20 seconds
  lgPlasmaPwrToggle, // send command again
  20000, // wait 20 more seconds
  lgPlasmaPwrToggle // and a final toggle
];
itach.send(cmd, function (err, res) {
  if (err) {
    console.log(err);
  } else {
    console.log(res);
  }
});
```

## Change log

###### 0.2

* Release
