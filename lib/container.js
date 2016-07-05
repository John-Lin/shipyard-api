var request = require('request');
var httpStatus = require('http-status');

function Container(id, host, key) {
  this.host = host || null;
  this.id = id || null;
  this.SERVICE_KEY = key || null;
}

Container.prototype.inspect = function (callback) {
  request.get(
    {
      url: this.host + '/containers/' + this.id + '/json',
      headers: { 'X-Service-Key': this.SERVICE_KEY },
    },
    function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var res = JSON.parse(body);
        callback(null, res);
      } else {
        callback(new Error(httpStatus[response.statusCode]));
      }
    });
};

Container.prototype.start = function (callback) {
  request.post(
    {
      url: this.host + '/containers/' + this.id + '/start',
      headers: { 'X-Service-Key': this.SERVICE_KEY },
    },
    function (error, response, body) {
      if (!error && response.statusCode === 204) {
        callback(null, body);
      } else {
        callback(new Error(httpStatus[response.statusCode]));
      }
    });
};

Container.prototype.remove = function (callback) {
  request.del(
    {
      url: this.host + '/containers/' + this.id + '?force=1',
      headers: { 'X-Service-Key': this.SERVICE_KEY },
    },
    function (error, response, body) {
      if (!error && response.statusCode === 204) {
        callback(null, body);
      } else {
        callback(new Error(httpStatus[response.statusCode]));
      }
    });
};

Container.prototype.restart = function (callback) {
  request.post(
    {
      url: this.host + '/containers/' + this.id + '/restart',
      headers: { 'X-Service-Key': this.SERVICE_KEY },
    },
    function (error, response, body) {
      if (!error && response.statusCode === 204) {
        callback(null, body);
      } else {
        callback(new Error(httpStatus[response.statusCode]));
      }
    });
};

Container.prototype.stop = function (callback) {
  request.post(
    {
      url: this.host + '/containers/' + this.id + '/stop',
      headers: { 'X-Service-Key': this.SERVICE_KEY },
    },
    function (error, response, body) {
      if (!error && response.statusCode === 204) {
        callback(null, body);
      } else {
        callback(new Error(httpStatus[response.statusCode]));
      }
    });
};

module.exports = Container;
