const CracoAntDesignPlugin = require("craco-antd");
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const webpack = require("webpack")
const pjson = require('./package.json');

module.exports = {
  plugins: [{ plugin: CracoAntDesignPlugin }],
  webpack: {
    plugins: [
      new webpack.DefinePlugin({
        '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
      }),
      new ReplaceInFileWebpackPlugin([{
        dir: './public',
        files: ['manifest.json'],
        rules: [{
            search: /"version": ".*",/i,
            replace: `"version": "${pjson.version}",`
        }]
      }])
    ]
  }
};