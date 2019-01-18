import fs from 'fs';
import path from 'path';
import glob from 'glob';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import baseConfig from './base';

const cwd = process.cwd();
const src = path.resolve(cwd, 'src');
const demo = path.resolve(cwd, 'demo');

function getDemos() {
  const demoFiles = glob.sync('**/demo.tsx', { cwd: src });
  return demoFiles.map(file => {
    return file.replace(/(components\/|\/demo.tsx)/g, '');
  });
}

function getIcons() {
  const icons = [];
  const iconfontPath = path.join(src, 'iconfont/iconfont.less');
  const iconfontData = fs.readFileSync(iconfontPath, 'utf8');
  const iconPattern = /.mgt-icon-(.+?)::before/gi;
  let match = null;
  while ((match = iconPattern.exec(iconfontData))) {
    icons.push(match[1]);
  }
  return icons;
}

export default webpackMerge(baseConfig, {
  mode: 'development',
  entry: './demo/index.jsx',
  output: {
    path: demo,
    publicPath: '',
    sourceMapFilename: 'sourcemaps/[file].map',
    pathinfo: true,
  },
  devtool: 'source-map',
  devServer: {
    hot: true,
    open: true,
    port: 36500,
    contentBase: demo,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEMOS__: JSON.stringify(getDemos()),
      __ICONS__: JSON.stringify(getIcons()),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(cwd, 'demo/index.html'),
    }),
  ],
});
