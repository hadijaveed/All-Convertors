var path = require('path'),
    webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.min.js',
    publicPath: 'http://localhost:3000/',
  },
  node: {
    fs: 'empty',
    child_process: 'empty'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
    // Force HTMLtoJSX to use the in-browser `document` object rather than
    // require the Node-only "jsdom" package.
        IN_BROWSER: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compressor: {
            warnings: false
        }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src')
      },

      {
        test: /\.css$/,
        loader: 'style!css'
      },

      {
        test: /\.less$/,
        loader: 'style!css!less'
      },

      {
        test: /\.(jpe?g|png|gif|svg|eot|woff|woff2|ttf|canvas)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },

      { test: /\.json$/, loader: 'json-loader' },

    ],

    postLoaders: [
      { loader: 'transform?brfs' }
    ]
  }
};
