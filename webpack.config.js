import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";
import webpack from "webpack";


import TerserJSPlugin from "terser-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import {CleanWebpackPlugin} from "clean-webpack-plugin";

// process.traceDeprecation = true;

const getLocalExternalIP = () => [].concat(...Object.values(os.networkInterfaces()))
    .filter(details => (details.family === "IPv4" || details.family === 4) && !details.internal)
    .pop()?.address;

const webConfig = (env, argv) => {
    const devMode = !argv || (argv.mode !== "production");
    const addr = getLocalExternalIP() || "0.0.0.0";
    const dirname = path.dirname(fileURLToPath(import.meta.url));
    return {

        entry: {main: "./src/index.js"},
        output: {
            path: path.resolve(dirname, "docs"),
            filename: devMode ? "[name].js" : "[name].[contenthash].js"
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [{
                        loader: MiniCssExtractPlugin.loader
                    }, "css-loader"],
                },
                {
                    test: /worker\.js$/,
                    use: { loader: "worker-loader" },
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
            }), new CssMinimizerPlugin()],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: "./src/index.html",
                minify: false,
                scriptLoading: "defer",
                inject: "head"
                // filename: 'index.html'
            }),
            new MiniCssExtractPlugin({
                filename: devMode ? "[name].css" : "[name].[contenthash].css"
            }),
            // ...(devMode ? [] : [new GenerateSW({
            //     swDest: '../sw.js',
            //     // these options encourage the ServiceWorkers to get in there fast
            //     // and not allow any straggling "old" SWs to hang around
            //     clientsClaim: true,
            //     skipWaiting: true,
            // })]),
            new webpack.DefinePlugin({
                __USE_SERVICE_WORKERS__: !devMode
            }),
            new CopyPlugin({
                patterns: [
                    { from: "./src/images", to: "./images" },
                    { from: "./src/sound", to: "./sound" },
                    { from: "./src/manifest.json", to: "./" },
                    { from: "./src/rules.html", to: "./" },
                    { from: "./.well-known", to: "./.well-known" },
                    { from: "./github", to: "./" }
                ],
            })
        ],
        devServer: {
            compress: true,
            port: 8080,
            hot: true,
            open: true,
            host: addr,
            // clientLogLevel: 'debug',
            // watchContentBase: true,
        }
    };
};

export default webConfig;
