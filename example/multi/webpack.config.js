const path = require('path')

module.exports = {
    entry: {
      app: './src/main.ts'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `[name].js`,
    },
    resolve: {
      extensions: ['.ts', '.vue', '.js'],
      modules: [
        path.join(__dirname, 'src'),
        'node_modules'
      ]
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            esModule: true
          }
        },
      ]
    },
    devtool: 'source-map'
  }
