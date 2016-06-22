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
    filename: 'bundle.js',
    publicPath: 'http://localhost:3000/',
  },
  node: {
    fs: 'empty',
    child_process: 'empty'
  },
  
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.ProvidePlugin({
      _: 'lodash',
      lodash: 'lodash'
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
      
      // expose lodaers here for the dev
      
      { test: require.resolve('react'), loader: 'expose?React' },
      { test: require.resolve('jquery'), loader: 'expose?$!expose?jQuery' },
      { test: require.resolve('lodash'), loader: 'expose?_!expose?lodash' },
      
      // {
      //   test: /\.(png|jpg)$/,
      //   loader: 'url-loader?limit=1000000',
      //    // inline base64 URLs for <=8k images, direct URLs for the rest
      // },
      
      // { test: /\.(png|jpg)$/, loader: 'file-loader' }
       
    ],
    
    postLoaders: [
      { loader: 'transform?brfs' }
    ]
  }
};
