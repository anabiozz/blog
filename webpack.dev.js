let path = require('path');
let webpack = require('webpack');
let core_url = process.env.CORE_URL ? process.env.CORE_URL : '/';

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        'babel-polyfill',
        './frontend/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle-dev.js',
        publicPath: core_url+'dist'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify('development'),
                NODE_MODE: JSON.stringify(process.env.NODE_MODE),
                CORE_URL: JSON.stringify(core_url)
            }
        })
    ],
    module: {
        rules: [
            {
              test: /\.jsx?$/, // both .js and .jsx
              loader: 'eslint-loader',
              include: path.resolve(__dirname, 'frontend'),
              enforce: 'pre',
              options: {
                fix: true,
              },
            },
            {
                exclude: [/node_modules/],
                include: [
                    path.resolve(__dirname, "frontend"),
                ],
                loader: 'react-hot-loader'
            },
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "frontend"),
                ],
                loader: 'babel-loader',
                query: {
                    plugins: ['transform-runtime']
                }
            },
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    }
};
