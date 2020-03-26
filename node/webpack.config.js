const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TsPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: {
    constants: './src/constants/index.ts',
    server: './src/app.ts',
    controllers: './src/controllers/index.ts',
    routers: './src/routes/index.ts'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          projectReferences: true
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    plugins: [
      new TsPathsWebpackPlugin({ configFile: './src/tsconfig.json' })
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'out'),
  },
};