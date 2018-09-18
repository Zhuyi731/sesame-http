const copyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const sesame = require("../index");

module.exports = {
    mode: "development",
    devServer: {
        before: (app) => {
            sesame.setConfig({
                rulePath: path.resolve("sesame.rule.js")
            });
            sesame.webpack(app);
        }
    },
    entry: {
        index: "./src/index.js"
    },
    output: {
        path: path.join(__dirname, "./dist"),
        filename: "[name].js"
    },
    plugins: [
        new copyWebpackPlugin({
            from: "./src/index.html",
            to: "./dist/index.html"
        })
    ]
}