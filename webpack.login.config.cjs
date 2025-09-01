const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    'login': './components/login/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/login'),
    filename: 'poj2-[name].umd.js',
    library: {
      name: 'Poj2Login',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'typeof self !== "undefined" ? self : this',
    clean: true
  },
  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react', 
      amd: 'react',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom', 
      root: 'ReactDOM'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'classic' }]
              ]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'poj2-[name].css'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  }
};