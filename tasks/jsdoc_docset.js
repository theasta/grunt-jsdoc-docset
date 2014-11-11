/*
 * grunt-jsdoc-docset
 * https://github.com/alexb/grunt-jsdoc-docset
 *
 * Copyright (c) 2014 Alexandrine Boissiere
 * Licensed under the MIT license.
 */

'use strict';

var DocSetGenerator = require('jsdoc-docset-generator');
var path = require('path');

module.exports = function(grunt) {

  grunt.registerMultiTask('jsdoc_docset', 'Generates a docSet from JSDoc documentation', function() {

    var done = this.async();
    var options = this.options();

    this.files.forEach(function (f){
      f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else if (!grunt.file.isDir(filepath)) {
          grunt.log.warn('Source "' + filepath + '" should be a directory.');
          return false;

        } else {
          return true;
        }
      });

      if (f.src.length !== 1) {
        grunt.log.warn('Please only pass one source folder at a time.');
      }

      var src = f.src[0];

      var docSetPath = path.resolve(src, 'docset.json');
      if (!grunt.file.exists(docSetPath)) {
        grunt.log.warn("Couldn't find any docset json file in the source directory. Please use the jsdoc-dash-template along with jsdoc.");
      }

      var entries = grunt.file.readJSON(docSetPath);

      var config = options;
      config.documentation = src;
      config.docSetRoot = f.dest;

      var generator = new DocSetGenerator(config);

      generator.populate(entries).then(done);

      // Print a success message.
      grunt.log.writeln('DocSet "' + f.dest + '" created.');

    });

  });

};
