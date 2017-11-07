
var debug = require('debug')('demo:queryHandler');

function search(query) {    
    debug('search setup');
    
    var where = {};
    var key;
        for (key in req.query) {
          if (key.indexOf('_') === -1) {
              // (test1|test3) = .replace(/[\W_]+/g,'')
              where[key] =  { $regex: new RegExp('.*?'+req.query[key].replace(/[\W_]+/g,'')+'.*') };
          }
        }
    
    return where;
}

function sort(query) {
    debug('sort setup');
    
    var options = {};
    options.sort = null;
    
    if (req.query._sort) {
            var prefix = 1;
            if (req.query._sort.match(/-/)) prefix = -1;
            var field = req.query._sort.replace(/-|\s/g, '');
            options.sort = {};
            options.sort[field] = prefix;
        }
}

//Updates to call
module.exports.cors = function(reg, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');   
    next();
}

module.exports.search = function () {
  return function (req, res, next) {
    // Add the search functionality to the request object
    req.where = search(req.query);
    
    //req.where[]
    
    next();
  };
};

module.exports.sort = function () {
  return function (req, res, next) {
    // Add the options sort functionality to the request object
    if (!req.options) req.options = {};
    req.options.sort = sort(req.query);
    next();
  };
};