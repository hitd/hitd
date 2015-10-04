var fs = require('fs');
var yaml = require('js-yaml');


exports.openFile = function(confLocation, cb) {
  var file;
  try {
    file = fs.readFileSync(confLocation, 'utf8');
  } catch (err) {
    return cb(err, file);
  }
};

exports.parseYMLFile = function(file, cb) {

  var conf;
  try {
    conf = yaml.safeLoad(file);
  } catch (err) {
    return cb(err);
  }

  cb(null, conf);

};
