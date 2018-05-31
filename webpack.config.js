const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: ["babel-polyfill", "./src/index.js"],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build")
    },
    module: {
        loaders: [
            {
                test: /\.json$/,
                use: "json-loader"
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ["env", 'es2015', 'react']
                }
            },
            {
                test: /\.s?css$/,
                loader: "style-loader!css-loader!sass-loader"
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }])
    ]
};
