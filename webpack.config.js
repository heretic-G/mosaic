const webpack = require("webpack");
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin  = require('clean-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');


module.exports = {
	entry:["webpack-dev-server/client?http://localhost:8080/",'./src/index.js'],
	output:{
		path: path.resolve(__dirname,'./dist'),
		filename: '[hash].js',
	},
	devServer:{
        historyApiFallback:true,
        hot:true,
        inline:true,
        //progress:true,//报错无法识别，删除后也能正常刷新
    },
	plugins:[
		new CleanWebpackPlugin(['dist']),
		new UglifyJsPlugin(),
		new HtmlWebpackPlugin({
	      	title: 'Mosaic',
	      	template: './src/index.html',
	      	minify: {
				collapseWhitespace: true,
				removeComments: true,
				removeAttributeQuotes: true
	      	}
	    }),
	    new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin(
            { 
                url: 'http://localhost:8080' 
            }
        ),
	]
}