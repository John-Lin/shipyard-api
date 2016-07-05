var request = require('request');
var httpStatus = require('http-status');
var Container = require('./container');
var templates = require('./config');

function ShipyardAPI(opts) {
  this.SERVICE_KEY = opts.serviceKey || null;
  this.HOST = opts.host || '127.0.0.1';
  this.PORT = opts.port || 8080;
  this.host = 'http://' +  this.HOST + ':' + this.PORT;
}

ShipyardAPI.prototype.authRequests = function(callback) {
  request.get(
    {
      url: this.host + '/v1.20/version',
      headers: {'X-Service-Key': this.SERVICE_KEY},
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var res = JSON.parse(body);
        callback(null, true, res);
      } else if (!error && response.statusCode === 401) {
        callback(null, false);
      } else {
        callback(error, false);
      }
    });
};

ShipyardAPI.prototype.login = function(username, password, callback) {
  var authBody = {};
  authBody.username = username;
  authBody.password = password;

  request.post(
    {
      url: this.host + '/auth/login',
      json: authBody,
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        callback(null, body);
      } else {
        callback(new Error(httpStatus[response.statusCode]));
      }
    });
};

ShipyardAPI.prototype.listContainers = function(callback) {
  request.get(
    {
      url: this.host + '/containers/json',
      headers: {'X-Service-Key': this.SERVICE_KEY},
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var res = JSON.parse(body);
        callback(null, res);
      } else {
        callback(new Error(httpStatus[response.statusCode]));
      }
    });
};

ShipyardAPI.prototype.createContainer = function(option, callback) {
  var _this = this;
  var createTemplate = templates.createTemplate;
  createTemplate.Image = option.image;
  createTemplate.Env = option.env;

  if (option.command) {
    for (var i = 0; i < option.command.length; i++) {
      createTemplate.Cmd.push(option.command[i]);
    }
  }

  if (option.portBindings) {
    for (var j = 0; j < option.portBindings.length; j++) {
      var fromContainer = option.portBindings[j].split('->')[0];
      var toHost = option.portBindings[j].split('->')[1];
      createTemplate.HostConfig.PortBindings[fromContainer] = [{HostPort: toHost}];
      createTemplate.ExposedPorts[fromContainer] = {};
    }
  }

  request.post(
    {
      url: this.host + '/containers/create?name=' + option.name,
      headers: {'X-Service-Key': this.SERVICE_KEY},
      json: createTemplate,
    },
    function(error, response, body) {
      if (!error && response.statusCode === 201) {
        var c =  _this.getContainer(body.Id);
        callback(null, c);
      } else {
        callback(new Error(httpStatus[response.statusCode]));
      }
    });
};

ShipyardAPI.prototype.getContainer = function(id) {
  return new Container(id, this.host, this.SERVICE_KEY);
};

ShipyardAPI.prototype.listNodes = function(callback) {
  request.get(
    {
      url: this.host + '/api/nodes',
      headers: {'X-Service-Key': this.SERVICE_KEY},
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var res = JSON.parse(body);
        callback(null, res);
      } else {
        callback(new Error(httpStatus[response.statusCode]));
      }
    });

};

ShipyardAPI.prototype.getNode = function(nodeName, callback) {
  request.get(
    {
      url: this.host + '/api/nodes/' + nodeName,
      headers: {'X-Service-Key': this.SERVICE_KEY},
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var res = JSON.parse(body);
        callback(null, res);
      } else {
        callback(new Error(httpStatus[response.statusCode]));
      }
    });

};

module.exports = ShipyardAPI;
