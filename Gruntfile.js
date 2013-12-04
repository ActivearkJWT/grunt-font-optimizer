/*
 * grunt-font-optimizer
 * -
 *
 * Copyright (c) 2013 Jesse Luoto / Activeark JWT
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Configuration to be run (and then tested).
    font_optimizer: {
      grouped: {
        options: {
        },
        files: {
          'optimized/': ['fonts/*.ttf'],
        },
      },
      single: {
        options: {
        },
        files: {
          'optimized/single.test.ttf': ['fonts/font.ttf'],
        },
      },
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // By default
  grunt.registerTask('default', ['jshint', 'font_optimizer']);

};
