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

    var ziplib = require('./lib/zipstream').init(grunt);

    grunt.registerMultiTask('zip', 'Create a ZIP file.', function() {
        var options = this.options();

        // Iterate over all specified file groups.
        var done = this.async();
        grunt.util.async.forEach(this.files, function(f, cb) {
            var dest = f.dest;

            // Warn on and remove invalid source files (if nonull was set).
            var src = f.src.filter(function(file) {
                if (!grunt.file.exists(file)) {
                    grunt.log.warn('Source file "' + file + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            // Zip each set of files.
            ziplib.createStream(dest, src, options, function(err, written) {
                if (!err) {
                    written = String(written);
                    grunt.log.writeln('File "' + dest + '" created.');
                    grunt.log.writeln('Total size: ' + written + ' bytes.');
                }
                cb(err);
            });
        }, function(err) {
            done(!err);
        });
    });


};
