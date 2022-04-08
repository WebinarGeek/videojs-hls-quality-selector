const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  context: __dirname,
  devtool: 'inline-source-map',
  mode: 'development',
  entry: './src/plugin.js',
  output: {
    path: `${__dirname}`,
    filename: 'dist/videojs-hls-quality-selector.min.js'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'index.html' },
        { from: 'node_modules/**' }
      ],
    }),
  ],
};
