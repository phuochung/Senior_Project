const lodash = require('lodash'),
  glob = require('glob');

module.exports.getGlobbedPaths = function (globPatterns, excludes) {
  const urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  let output = [];

  if (lodash.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = lodash.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (lodash.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(function (file) {
          if (lodash.isArray(excludes)) {
            for (let i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '');
              }
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = lodash.union(output, files);
    }
  }

  return output;
};