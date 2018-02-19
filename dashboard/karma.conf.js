/*
 * Copyright (c) 2015-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
'use strict';

var webpackConfig = require('./webpack.config');

module.exports = function (config) {

  var configuration = {
    basePath: '',
    singleRun: true,
    frameworks: ['jasmine'],
    files: [
      'node_modules/babel-polyfill/browser.js',      // add polyfill for PhantomJS
      'index.ts',                                    // add index.js for UD app
      'node_modules/angular-mocks/angular-mocks.js', // add angular-mocks for unit mocking
      'src/**/*.spec.ts'],                           // add *.spec.ts for the unit tests
    autoWatch: true,
    preprocessors: {
      '**/*.ts': ['webpack'] // handle ts files through webpack
    },
    // delegate to webpack configuration
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },

    logLevel: 'INFO',
    concurrency: Infinity,

    browsers: ['PhantomJS'], // can be replaced by Chrome

    plugins: [
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-jasmine',
    ],

    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },

    // to avoid DISCONNECTED messages on slow/busy machines
    browserDisconnectTimeout: 10000, // default 2000
    browserDisconnectTolerance: 1, // default 0
    browserNoActivityTimeout: 60000, //default 10000

    reporters: ['progress'],
    // specify the mime type
    mime: {
      'text/x-typescript': ['ts']
    }
  };

  config.set(configuration);
};
