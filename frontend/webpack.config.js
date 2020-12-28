const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('config');
const LocalIpPlugin = require("local-ip-webpack-plugin")

console.log(JSON.stringify(config));

module.exports = {
    devtool: "source-map",
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.ts(x)?$/,
                use: [
                    'awesome-typescript-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js'
        ]
    },
    plugins: [
        new LocalIpPlugin(),
        // new CopyWebpackPlugin({
        //     patterns: [{
        //         context: './',
        //         from: 'assets/**/*',
        //     }],
        // }),
        new webpack.DefinePlugin({
            CONFIG: JSON.stringify(config),
        }),
        new HtmlWebpackPlugin({
            // template: require('html-webpack-template'),
            template: path.join('src', 'index.html'),
            // inject: true,
            appMountId: 'app',
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin(),
    ],
};
