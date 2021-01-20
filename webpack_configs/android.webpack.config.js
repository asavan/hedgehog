const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    return {

        entry: {main: "./src/index.js"},
        output: {
            path: path.resolve(__dirname, "../android/app/src/main/assets/www"),
            filename: "[name].[contenthash].js"
        },
        module: {
            rules: [
                {
                    test: /.css$/i,
                    use: [{
                        loader: MiniCssExtractPlugin.loader
                    }, 'css-loader'],
                }
            ]
        },
        optimization: {
            minimizer: [new TerserJSPlugin({
                terserOptions: {
                    mangle: true,
                    compress: {
                        drop_console: true
                    }
                }
            }), new CssMinimizerPlugin({})],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "./src/index.html",
                minify: false,
                scriptLoading: 'defer',
                // filename:  "index.html",
                inject: 'head',
            }),
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash].css'
            }),
            new webpack.DefinePlugin({
                __USE_SERVICE_WORKERS__: false
            }),
            new CopyPlugin({
                patterns: [
                    { from: './images', to: './images' },
                    { from: './sound', to: './sound' },
                    { from: './manifest.json', to: './' },
                ],
            })
        ]
    }
};
