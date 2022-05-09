import path from 'path'
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import TerserJSPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin'

import webpack from 'webpack'


const androidConfig = (env, argv) => {
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    return {
        entry: {main: "./src/index.js"},
        output: {
            path: path.resolve(dirname, "../android/app/src/main/assets/www"),
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
                    { from: './src/images', to: './images' },
                    { from: './src/sound', to: './sound' },
                    { from: './src/rules.html', to: './' },
                    { from: './src/manifest.json', to: './' },
                    { from: './.well-known', to: './well-known' }
                ],
            })
        ]
    }
};

export default androidConfig;
