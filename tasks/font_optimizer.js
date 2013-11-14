/*
 * grunt-font-optimizer
 * -
 *
 * Copyright (c) 2013 Jesse Luoto / Activeark JWT
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  
    grunt.registerMultiTask('font_optimizer', 'Optimize TTF fonts with Grunt', function() {
        
        // Init ShellJS
        var shell = require('shelljs');
        
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
            shell.cd(process.cwd() + "/lib/font-optimizer/");
            var relativeDestnation = "../../" + f.dest;
            var relativeSources = f.src.map(function(filepath) {
                return "../../" + filepath;
            });
            
            
            relativeSources.forEach(function(filepath) {
                
                
                // Allow destination to be folder
                var destination = relativeDestnation;
                if(destination.substr("-1") === "/") {
                    // Add basepath of filename to destination path
                    destination += filepath.replace(/^.*\//g, '');
                }
                
                // build execution command
                var cmd = [];
                cmd.push("perl -X ./subset.pl"); // Main executable
                cmd.push("--chars=" + options.chars); // Included characters
                if(options.includeFeatures && options.includeFeatures.length !== 0) {
                    // Included font features
                    cmd.push("--include=" + options.includeFeatures.join(","));
                }
                cmd.push(filepath);
                cmd.push(destination);
                cmd = cmd.join(" ");
                
                // Debug message
                grunt.log.write('Creating file "' + destination.substr(6) + '"... ');
                
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
            
            return f;
        });
    });

};
