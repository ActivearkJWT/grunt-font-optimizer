# grunt-font-optimizer

> Optimize TTF fonts and make font subsets with Grunt

## Getting Started
This plugin requires Grunt `~0.4.1` and Perl

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-font-optimizer --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-font-optimizer');
```

## The "font_optimizer" task

### Overview
In your project's Gruntfile, add a section named `font_optimizer` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  font_optimizer: {
    default {
      options: {
        // Characters to include
        chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        
        // Features to include.
        includeFeatures: ['kern']
      },
      files: {
        'fonts/font-optimized.ttf': ['fonts/font.ttf'],
      },
    },
  },
})
```


### Options

#### options.chars
Type: `String`
Default value: `'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'`

List of characters to include in the optimized subset of font.

#### options.includeFeatures
Type: `Array`
Default value: `['kern']`

Font features to include in the optimized font.
- Use "none" to include no features.
- Leave array empty to include all features.

See list of all supported font features:
http://en.wikipedia.org/wiki/OpenType_feature_tag_list#OpenType_typographic_features

### Usage Examples

#### Optimizing file-by-file
Default behaviour is to add each font as it's own row to the `option.files`

```js
grunt.initConfig({
  font_optimizer: {
    default {
      options: {},
      files: {
        'fonts/font-optimized.ttf': ['fonts/font.ttf'],
        'fonts/font2-optimized.ttf': ['fonts/font2.ttf'],
      },
    },
  },
})
```

#### Optimizing whole directory at the time
You can also describe a wildcard selector to include e.g. the whole directory.
In That case, describe a folder (ending with `/`) as the target:

```js
grunt.initConfig({
  font_optimizer: {
    default {
      options: {},
      files: {
        'optimized-fonts/': ['fonts/*.ttf'],
      },
    },
  },
})
```

## Attributions

Uses [Google Font Directory](https://code.google.com/p/googlefontdirectory/) perl script to do the optimization.
Google Font Directory script licensed under [MIT license](http://www.opensource.org/licenses/mit-license.php).
