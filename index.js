"use strict";

var fs = require('fs'),
  path = require("path"),
  htmlMinifier = require('html-minifier').minify;

var dirFilesHtmlMinify = function (dirPath, book) {
  fs.readdir(dirPath, function (err, files) {
    if (err) throw err;
    files.map(function (fileName) {

      // fileName to filePath
      return path.join(dirPath, fileName);

    }).forEach(function (filePath) {
      if (fs.statSync(filePath).isFile() && filePath.match(/\.html$/) !== null) {
        // read html
        var html = fs.readFileSync(filePath, 'utf8');

        // html minify
        var minifiedHtml = htmlMinifier(html, book.config.get('pluginsConfig')['html-minifier']);

        // overwrite minified html
        fs.writeFileSync(filePath, minifiedHtml);

        book.log.info.ln('html-minifier "' + filePath + '"');
      } else if (fs.statSync(filePath).isDirectory()) {

        // recursive
        dirFilesHtmlMinify(filePath, book);
      }
    });
  });
}

module.exports = {
  hooks: {
    "finish:before": function () {
      dirFilesHtmlMinify(
        this.output.root(),
        this
      );
    }
  }
};
