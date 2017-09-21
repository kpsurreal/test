var path = require('path');
var webpack = require('webpack');
var glob = require('glob');

function getEntry(globPath) {
  var entries = {},
    basename, tmp, pathname;
  glob.sync(globPath).forEach(function(entry) {
    if (!/common/.test(entry)) {
      basename = path.basename(entry, path.extname(entry));   // 文件名
      tmp = entry.split('/').splice(3);
      // console.log(tmp);
      if (tmp.length === 1) {
        pathname = basename;
      } else {
        pathname = tmp.splice(0, tmp.length - 1).join('/') + '/' + basename; 
      }
      entries[pathname] = entry;
    }
  });
  return entries;
}

var entries = getEntry('./src/js/**/*.js');
// console.log(entries);
// process.exit();

module.exports = {
  entry: entries,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './public/dist/js/')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
            'less': 'vue-style-loader!css-loader!less-loader'
          }
        }
      },
      {
        test: /\.less$/,
        use: 'less-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'inline-source-map', // 开发环境使用这个 map 
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map' // 生产环境使用这个 map
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}