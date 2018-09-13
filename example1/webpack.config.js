const htmlWebpackPlugin = require("html-webpack-plugin");
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
        new htmlWebpackPlugin({
            template: path.join(__dirname, "src/index.html"),
            filename: "index.html",
            chunks: ["index"],
            inject: "body"
        })
    ]
}