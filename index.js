'use strict';
var Itach;
var net = require('net');
var dgram = require('dgram');

//used to listen to beacon datagrams
var PORT = 9131;
var ITACHBEACONADDRESS = '239.255.250.250';
var BEACONTIMEOUTMILLIS = 60000;

var next = function (cmd, cb) {
  cmd.shift();
  if (typeof cmd[0] === 'number') {
    return setTimeout(function () { return next(cmd, cb); }, cmd[0]);
  }
  return cb(cmd);
};

var Endpoint = function(beaconXML) {
	var MODEL = /.*<-Model=(.*)><-R/;
	var CONFIGURL = /.*<-Config-URL=(.*)><-P/;
	var pingTime;
	
	this.modelNumber = MODEL.exec(beaconXML)[1];
	this.configURL = CONFIGURL.exec(beaconXML)[1];
	this.ip = this.configURL.substr(this.configURL.indexOf('://') + 3);
	//console.log("creating an endpoint for: " + this.modelNumber + "@" + this.ip);
	
};
Endpoint.prototype.getIp = function() {return this.ip;};
Endpoint.prototype.getConfigUrl = function() {return this.configURL;};
Endpoint.prototype.setPingTime = function(timeInMillis) {this.pingTime = timeInMillis;};
Endpoint.prototype.getPingTime = function() {return this.pingTime;};

module.exports = Itach = function (host) {
  this.host = host;
  this.endpoints = {};
  this.server;
};
Itach.prototype.getEndpoints = function() {return this.endpoints;};

Itach.prototype.locate = function() {
	this.server = dgram.createSocket('udp4');
	var _self = this;

	function checkTimeouts() {
		var currentTimeMillis = new Date().getTime();
		for (var ip in _self.endpoints) {
			var ep = _self.endpoints[ip];
			if (currentTimeMillis - ep.getPingTime() > BEACONTIMEOUTMILLIS) {
				//console.log(ep.getIp() + " flagged for removal");
				delete _self.endpoints[ip];
			}
		}
		console.log(_self.endpoints);
	}

	this.server.on('message', function(message) {
		var ep = new Endpoint(message);
		var currentTimeMillis = new Date().getTime();
		if ('' + ep.getIp() in _self.endpoints) {
			var toUpdate = _self.endpoints['' + ep.getIp()];
			toUpdate.setPingTime(currentTimeMillis);
		} else {
			ep.setPingTime(currentTimeMillis);
			_self.endpoints['' + ep.getIp()] = ep;
		}
	});

	this.server.on('listening', function() {
		this.setBroadcast(true);
		this.addMembership(ITACHBEACONADDRESS);
	});
	
	this.server.bind(PORT);
	setInterval(function(){checkTimeouts()}, 10000);
};

Itach.prototype.stopLocation = function() {
	server.close();
};

Itach.prototype.send = function (command, callback) {
  var err;
  var res = [];
  var socket = new net.Socket();

  if (!this.host) {
    return callback(new Error('No host'));
  }

  if (!Array.isArray(command)) {
    command = [command];
  }

  if (typeof command[0] === 'number') {
    return callback(new Error('First element has to be a command (string)'));
  }

  socket.setEncoding('ASCII');
  socket.connect(4998, this.host);
  socket.on('data', function (chunk) {
    res.push(chunk);
    next(command, function (cmd) {
      command = cmd;
      if (command.length !== 0 && command[0]) {
        socket.write(command[0], 'ASCII');
      } else {
        socket.end();
      }
    });
  });
  socket.on('error', function (error) {
    err = error; // error with connection, closes socket
  });
  socket.on('close', function () {
    if (err) {
      return callback(err);
    }
    return callback(null, res);
  });

  // write first command
  socket.write(command[0], 'ASCII');

};