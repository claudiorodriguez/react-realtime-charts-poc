/* tslint:disable no-require-imports */
const path = require('path');
const autoprefixer = require('autoprefixer');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postCssNested = require('postcss-nested');

const env = process.env.NODE_ENV || 'development';
const DEV = env !== 'production';

const config = {
  devtool: 'source-map',
  devServer: {
    before: (app) => {
      app.get('/api/stream', function(_, res) {
        res
          .status(200)
          .type('text/event-stream')
          .set({
            connection: 'keep-alive',
            'cache-control': 'no-cache'
          });

        const writeData = () => {
          const data = {value: Math.floor(Math.random() * 1000)};

          res.write(`data: ${JSON.stringify(data)}\n\n`);
        };

        writeData();
        setInterval(writeData, 100);
      });
    },
    contentBase: ['demo/', 'node_modules/'],
    disableHostCheck: true,
    inline: true,
    publicPath: '/dist/',
    watchContentBase: true
  },
  entry: {
    index: ['./src/index.tsx']
  },
  mode: env,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-modules-typescript-loader'
          },
          {
            loader: 'css-loader',
            options: {
              localsConvention: 'camelCase',
              importLoaders: 3,
              modules: {
                mode: 'local',
                localIdentName: DEV ? '[path]__[local]___[hash:base64:5]' : '[local]_[hash:base64:5]'
              },
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [autoprefixer(), postCssNested()];
              },
              sourceMap: true
            }
          }
        ]
      },
      {
        exclude: /node_modules/,
        test: /.*\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: DEV
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: !DEV,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      })
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  plugins: [
    new MiniCssExtractPlugin({
      chunkFilename: '[id].css',
      filename: '[name].css'
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
};

module.exports = config;
