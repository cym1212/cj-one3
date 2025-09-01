const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: './components/Signup.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/signup'),
    filename: 'poj2-signup.umd.js',
    library: {
      name: 'Poj2Signup',
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
        test: /\.(ts|tsx|js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'classic' }],
                '@babel/preset-typescript'
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
      filename: 'poj2-signup.css'
    })
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css']
  }
};