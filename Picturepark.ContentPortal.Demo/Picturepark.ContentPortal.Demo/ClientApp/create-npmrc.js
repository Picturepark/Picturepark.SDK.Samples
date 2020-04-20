var packagejson = require('./package.json');
var versionRegex = new RegExp('pre-[0-9a-f]{7}', '');

if (packagejson && packagejson.dependencies && packagejson.dependencies['@picturepark/sdk-v1-angular']) {
  var fs = require('fs');
  var sdkng = packagejson.dependencies['@picturepark/sdk-v1-angular'];

  console.log('@picturepark/sdk-v1-angular    version' + sdkng);

  fs.unlink('.npmrc', (err) => {
    if (err && err.code == 'ENOENT') {
      console.info('.npmrc file does not exist');
    } else if (err) {
      console.error('Error occurred while deleting .npmrc \n' + err);
    } else {
      console.log('.npmrc file deleted');
    }
  });

  if (versionRegex.test(sdkng)) {
    var args = process.argv.slice(2);
    var npmrcContent =
      `registry=https://npm.pkg.github.com/picturepark
_authToken=` + args[0];

    fs.writeFile('.npmrc', npmrcContent, (err) => {
      if (err) {
        return console.error('Error occurred while creating .npmrc \n' + err);
      }

      console.log('.npmrc file created');
    });
  }
}

if (packagejson && packagejson.dependencies && packagejson.dependencies['@picturepark/sdk-v1-angular-ui']) {
  var sdkngui = packagejson.dependencies['@picturepark/sdk-v1-angular-ui'];
  console.log('@picturepark/sdk-v1-angular-ui   version' + sdkngui);
}
