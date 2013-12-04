/*
 * grunt-font-optimizer
 * -
 *
 * Copyright (c) 2013 Jesse Luoto / Activeark JWT
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    // Init ShellJS
    var shell = require('shelljs');
    var path = require('path');
    var util = require('util');
    
    grunt.registerMultiTask('font_optimizer', 'Optimize TTF fonts with Grunt', function() {
        
        
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            
            // Characters to include
            chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            
            // Features to include.
            // - Use "none" to include no features.
            // - Leave array empty to include all features.
            // See list of all features:
            // http://en.wikipedia.org/wiki/OpenType_feature_tag_list#OpenType_typographic_features
            includeFeatures: ['kern']
            
        });
        
            
        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            
            // Filter non-existing sources
            f.src.filter(function(filepath) {
                if (!grunt.file.exists()) {
                    grunt.log.warn('Source file "' + f.src + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });
            
            // Don't proceed if no files found
            if(f.src.length === 0) {
                return f;
            }
            
            // Subset.pl works only when run on correct folder,
            // so let's fix the paths.
            var absoluteDestination = path.resolve(f.dest);
            var paths = f.src.map(function(filepath) {
                return {
                    'absolute': path.resolve(filepath),
                    'relative': filepath
                };
            });
            // Save old path so we can cwd back into it
            var oldCwd = path.resolve(".");
            shell.cd(__dirname + "/../lib/font-optimizer/");
            
            
            paths.forEach(function(path) {
                
                // Allow destination to be folder
                var destination = absoluteDestination;
                var relativeDestination = f.dest;
                
                if(grunt.file.isDir(absoluteDestination)) {
                    // Add basepath of filename to destination path
                    destination += "/" + path.relative.replace(/^.*\//, '');
                    relativeDestination += "/" + path.relative.replace(/^.*\//, '');
                }
                
                // build execution command
                var cmd = [];
                cmd.push("perl -X ./subset.pl"); // Main executable
                cmd.push(util.format('--chars="%s"', options.chars.replace('"', '\\"'))); // Included characters
                if(options.includeFeatures && options.includeFeatures.length !== 0) {
                    // Included font features
                    cmd.push("--include=" + options.includeFeatures.join(","));
                }
                cmd.push('"' + path.absolute + '"');
                cmd.push('"' + destination + '"');
                cmd = cmd.join(" ");
                
                // Debug message
                grunt.log.write('Creating file "' + relativeDestination + '"... ');
                
                var result = shell.exec(cmd, {silent: true});
                if(result.code !== 0) {
                    grunt.log.writeln(grunt.log.wordlist(['Success'], {color: 'green'}));
                } else {
                    // subset.pl doesn't always fail completely, for example on
                    // fsType 4 error. So we'll assume these errors are just
                    // warnings and let the user decide what to do.
                    grunt.log.writeln(grunt.log.wordlist(['\nWarning: ' + result.output], {color: 'yellow'}));
                }
                
            });

            shell.cd(oldCwd);
            
            return f;
        });
    });

};
