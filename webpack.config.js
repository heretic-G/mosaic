const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin  = require('clean-webpack-plugin');



module.exports = {
	entry:'./src/index.js',
	output:{
		path: path.resolve(__dirname,'./dist'),
		filename: '[chunkhash].js',
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
	    })
	]
}