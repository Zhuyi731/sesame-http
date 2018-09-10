const htmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: { index: "src/index.js" },
    output: {
        path: "dist",
        filename: "[name].js",
    },
    plugins: [new htmlWebpackPlugin({
        template: path.join(__dirname, "src/index.html"),
        filename: "index.html",
        chunks: ["index"],
        inject: "body"
    })]
}