var webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    config = require('./webpack.config');



new WebpackDevServer(webpack(config), {

    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 300
    }

}).listen(3000, 'localhost', (err, result) => {

    if (err) {
        return console.log(err);
    }

    console.log('Listening at http://localhost:3000/');
});
