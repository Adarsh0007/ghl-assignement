const { override, addWebpackPlugin, addWebpackOptimization } = require('customize-cra');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = override(
  // Add compression plugin for gzip/brotli compression
  addWebpackPlugin(
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    })
  ),

  // Add brotli compression
  addWebpackPlugin(
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    })
  ),

  // Bundle analyzer (only in analyze mode)
  process.env.ANALYZE &&
    addWebpackPlugin(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'bundle-report.html',
      })
    ),

  // Advanced optimization configuration
  addWebpackOptimization({
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react',
          chunks: 'all',
          priority: 20,
        },
        lucide: {
          test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
          name: 'lucide',
          chunks: 'all',
          priority: 15,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: process.env.NODE_ENV === 'production',
            drop_debugger: process.env.NODE_ENV === 'production',
            pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log'] : [],
          },
          mangle: {
            safari10: true,
          },
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  })
); 