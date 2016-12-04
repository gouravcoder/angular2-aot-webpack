const path = require( 'path' );

const { ContextReplacementPlugin, DefinePlugin, LoaderOptionsPlugin, NoErrorsPlugin, ProgressPlugin, HotModuleReplacementPlugin,
  optimize: { UglifyJsPlugin, CommonsChunkPlugin } 
} = require( 'webpack' );

const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

let devtool = 'inline-source-map',
    entry   = {
      'live-reload' : [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server'
      ],
      'vendor'    : './app/vendor.ts',
      'polyfills' : './app/polyfills.ts',
      'main'      : './app/main.ts'
    },
    plugins = [];

if ( process.env.NODE_ENV == 'production' ) {
  devtool = ( process.env.WEBPACK_KEEP_SRC_MAP ) ? 'inline-source-map' : false;
  entry = [
    './app/vendor.ts',
    './app/polyfills.ts',
    './app/main.aot.ts'
  ];
  plugins.push(
    new LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new NoErrorsPlugin(),
    new UglifyJsPlugin({
      compress: {
        drop_console: true,
        screw_ie8: true,
        warnings: true
      },
      mangle: {
        screw_ie8 : true
      },
      comments: false,
      sourceMap: process.env.WEBPACK_KEEP_SRC_MAP
    })
  );
} else {
  plugins.push(
    new HotModuleReplacementPlugin(),
    new CommonsChunkPlugin({
      name: [ 'polyfills', 'vendor', 'main', 'live-reload' ].reverse()
    })
  );
}

exports.devtool = devtool;

exports.entry = entry;

exports.context = path.join( process.cwd(), 'src' );

exports.module = {
  rules: [{
    test: /\.ts$/,
    use: [ 'awesome-typescript-loader', 'angular2-template-loader' ]
  }, {
    test: /\.html$/,
    use: 'raw-loader'
  }, {
    test: /\.css$/,
    exclude: /node_modules/,
    use: [ 'to-string-loader', 'css-loader' ]
  }, {
    test: /\.scss$/,
    loaders: [ 'to-string-loader', 'css-loader', 'sass-loader' ]
  }]
};

exports.devServer = {
  port: 8080,
  inline: true,
  historyApiFallback: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 500
  }
};

exports.output = {
  path: path.join( process.cwd(), 'dist' ),
  filename: '[name].bundle.js'
};

exports.plugins = [
  new ProgressPlugin(),
  new ContextReplacementPlugin(
    // The (\\|\/) piece accounts for path separators in *nix and Windows
    /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
    path.join( process.cwd(), 'src' )
  ),
  new HtmlWebpackPlugin({
    template: './index.html'
  }),
  new DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify( process.env.NODE_ENV )
    }
  }),
  ...plugins
];

exports.resolve = {
  modules: [
    'node_modules',
    path.resolve( process.cwd(), 'src' )
  ],
  extensions: ['.ts', '.js']
};