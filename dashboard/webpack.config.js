const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');
var bootstrap = require('bootstrap-styl');

//const stylus_plugin = require('stylus_plugin');

module.exports = {
    context: __dirname,
    entry: './index.ts',
    devtool: 'inline-source-map',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/assets' , to:'assets/' }
        ])
    ],
    resolve: {
        extensions: [ '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                exclude: /node_modules/
              }
,             
            {
                test: /\.ts$/,
                use: [
                    { 
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                          }
                     },
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
              },
            {
                test: /\.(png|svg)$/,
                use: {
                   loader: 'file-loader',
                   options: {
                        name: 'img/[name].[ext]', // check the path
                  }

            }
        },
        {
            test: /\.styl$/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'stylus-loader?paths=node_modules/bootstrap-styl',
                options: {
                    preferPathResolver: 'webpack',
                  use: [bootstrap()],
                },
              },
            ],
          },
          {
            test: /\.(svg|woff|woff2|ttf|eot|ico)$/,
            use: [
              {
                loader: 'file-loader'
              }
            ]
          },
            {
                test: /\.html$/,
                use: [
                    {
                      loader: 'ngtemplate-loader',
                      options: {
                        angular: true,
                      },
                    },
                    {
                      loader: 'raw-loader',
                    },
                  ],
            }

            /*,
            {
                test: /\.html$/,
                loader: 'raw-loader'
              },*/
        ]
    },
    devServer: {
        port: 3000,
        proxy: {
            "/api": "http://localhost:8080"
          }
    }
}
