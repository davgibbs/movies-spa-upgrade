// Karma configuration
// Generated on Wed Aug 10 2016 00:22:16 GMT+0100 (IST)

// remove entry value since karma-webpack will set its value automatically
//var webpackConfig = require("./webpack.test.js");
//webpackConfig.entry = null;

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      //'./node_modules/jasmine-core/lib/jasmine-core/jasmine.js',
      //'apps/movies/static/movies/test/lib/angular.min.js', // This needs to be kept in sync with webpack version somehow
        './node_modules/angular/angular.min.js',
        './node_modules/angular-mocks/angular-mocks.js',
      //'apps/movies/static/movies/test/lib/angular-mocks.js',

//      'apps/movies/static/movies/lib/angular-ui-router.min.js',
//      'apps/movies/static/movies/lib/angular-resource.min.js',
//      'apps/movies/static/movies/lib/angular-animate.js',
//      'apps/movies/static/movies/lib/dirPagination.js',
//      'apps/movies/static/movies/lib/ui-bootstrap-tpls-2.0.0.js',
      //'apps/movies/static/movies/js/index.js',
        'apps/movies/static/movies/bundle/vendor.js',
        'apps/movies/static/movies/bundle/app.js',
//      'apps/movies/static/movies/js/app.js',
//      'apps/movies/static/movies/js/services.js',
//      'apps/movies/static/movies/js/directives.js',
//      'apps/movies/static/movies/js/controllers.js',
      'apps/movies/static/movies/test/spec/*Spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'apps/movies/static/movies/js/*.js': ['coverage']
    },

    //webpack: webpackConfig,
    //webpackMiddleware: {
      //noInfo: true
      //stats: 'errors-only'
    //},

    // list of karma plugins
    plugins : [
        'karma-coverage',
        'karma-chrome-launcher',
        'karma-firefox-launcher',
        'karma-jasmine',
        'karma-phantomjs-launcher'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    coverageReporter: {
        type: 'text'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['PhantomJS'],
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
