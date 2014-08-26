# simple-itach.js

A simple, unofficial and unsupported, node.js module for sending ir commands to Global Caché's iTach devices.

Tested on iTach IP2IR (PoE model).

## Installation

## Usage

Require the simple-itach library
```
var Itach = require('./index.js');
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
var Itach = require('./index.js');
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
var Itach = require('./index.js');
var itach = new Itach('192.168.0.123');
var lgPlasmaPwrToggle = 'sendir,1:3,1,38226,1,1,343,171,21,22,21,22,21,65,21,22,21,22,21,22,21,22,21,22,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,65,21,22,21,22,21,22,21,65,21,22,21,22,21,22,21,22,21,65,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,3822\r';
var cmd = [
  lgPlasmaPwrToggle, // send command
  10000, // wait 10 seconds
  lgPlasmaPwrToggle, // send command again
  10000, // wait 10 more seconds
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

###### 0.1.3

* Changed name
* Method send's first argument now accept delays as elements.

###### 0.1.2

* Minor changes

###### 0.1.1

* Minor changes

###### 0.1

* Initial working release
