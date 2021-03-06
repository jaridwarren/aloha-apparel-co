const path = require('path');
const resolve = require('path').resolve;
const src = resolve(__dirname, 'src');
const imgs = resolve(__dirname, 'assets/images');
const fonts = resolve(__dirname, 'assets/fonts');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  entry: './src/entry.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: {
                safe: true
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              autoprefixer: {
                browsers: ['last 2 versions']
              },
              plugins: () => [autoprefixer]
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        loader: 'eslint-loader?configFile=.eslintrc',
        include: [src],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['env']
        },
        include: [src],
        exclude: /node_modules/
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        include: [fonts],
        exclude: [imgs],
        use: {
          loader: 'url-loader'
        }
      },
      {
        test: /\.(gif|png|jpe?g)$/,
        include: [imgs],
        exclude: [fonts],
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          },
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
              name: 'images/[name]_[sha512:hash:base64:7].[ext]'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 3000,
    stats: 'errors-only',
    publicPath: '/dist/',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    }
  },
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new OpenBrowserPlugin({ url: 'http://localhost:3000/' })
  ]
};
