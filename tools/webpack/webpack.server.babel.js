'use strict'; // eslint-disable-line

const path = require('path');
const webpack = require('webpack');
// eslint-disable-next-line import/no-extraneous-dependencies
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [nodeExternals({
    // Load non-javascript files with extensions, presumably via loaders
    whitelist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
  })],
  devtool: 'hidden-source-map',
  context: path.join(process.cwd()),
  entry: { server: ['./src/server.js'] },
  output: {
    path: path.join(process.cwd(), './build'),
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loaders: 'eslint',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          babelrc: false,
          presets: [['es2015', { modules: false }], 'react', 'stage-0'],
          plugins: ['transform-runtime'],
        },
      },
      { test: /\.json$/, loader: 'json' },
      { test: /\.css$/, loaders: ['css/locals', 'postcss'] },
      { test: /\.scss$/, loaders: ['css/locals', 'postcss', 'sass'] },
      { test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: 'url' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url' },
      { test: /\.(jpe?g|png|gif)$/, loader: 'url' },
    ],
  },
  plugins: [
    // Setup global variables for server
    new webpack.LoaderOptionsPlugin({
      options: {
        // Javascript lint
        eslint: {
          failOnError: true,  // Disable js lint error terminating here
        },
      },
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
      __CLIENT__: false,
      __SERVER__: true,
      __DEV__: process.env.NODE_ENV !== 'production',
      __DISABLE_SSR__: false,   // Disable server side render here
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: ['src', 'node_modules'],
  },
  node: {
    __filename: true,
    __dirname: true,
    global: true,
  },
};
