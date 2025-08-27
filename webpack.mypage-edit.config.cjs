const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'mypage-edit': './app/components/ui/MyPageEditStandalone.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist/myzone'),
    filename: 'poj2-mypage-edit.umd.js',
    library: {
      name: 'Poj2MyPageEdit',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'typeof self !== "undefined" ? self : this',
    clean: false
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
        test: /\.(ts|tsx)$/,
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
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, './app')
    }
  }
};