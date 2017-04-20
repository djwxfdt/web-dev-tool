const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isPublish = process.env.NODE_ENV === 'production'

const path = require('path')

var plugins = []

plugins.push(new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(process.env.node_env)
}))


plugins.push(new HtmlWebpackPlugin({template: 'src/renderer/index.html',hot:isPublish?false:true}))


let config = {
    entry: path.resolve('./src/renderer/index.js'),
    output: {
        path: path.resolve('./dist'),
        filename:"js/[name].js"
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules:[{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader'
        },{
            test: /\.less$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "less-loader"
            }]
        }]
    },
    plugins: plugins
}

if (!isPublish) {
    config.watch = true
}

module.exports = config
