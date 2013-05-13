/*
 * grunt-zipstream
 * https://github.com/Two-Screen/grunt-zipstream
 *
 * Copyright (c) 2013 Stéphan Kochen
 * Licensed under the MIT license.
 */
module.exports = function(grunt) {
    'use strict';
    /*global require */

    var ziplib = require('archiver');

    grunt.registerMultiTask('zip', 'Create a ZIP file.', function() {
        var options = this.options();

        // Iterate over all specified file groups.
        var done = this.async(),
            zip = ziplib('zip'),
            fs = require('fs'),
            path = require('path');
        zip.on('error',function(e) {
            throw e;
        });
        grunt.util.async.forEach(this.files, function(f, cb) {
            var dest = f.dest;

            zip.pipe(fs.createWriteStream(dest));

            var src = grunt.util._.chain(f.src)
            // Warn on and remove invalid source files (if nonull was set).
            .filter(function(file) {
                if (!grunt.file.exists(file)) {
                    grunt.log.warn('Source file "' + file + '" not found.');
                    return false;
                } else return true;
            })
            // Recurse directories.
            .map(function(file) {
                if (grunt.file.isDir(file)) {
                    var files = [];
                    grunt.file.recurse(file, function(file) {
                        files.push(file);
                    });
                    return files;
                } else return file;
            })
            .flatten(src)
            .unique()
            .value();

            // Zip each set of files.
            for (var i in src)
                zip.append(fs.createReadStream(src[i]),{name:src[i]});
        }, function(err) {
            done(!err);
        });
        zip.finalize(function(err, written) {
            if (err) throw err;
            console.log(written + ' total bytes written');
        });
    });
};
