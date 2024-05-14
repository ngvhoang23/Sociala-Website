const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const withReport = process.env.npm_config_withReport;

module.exports = {
  plugins: [withReport ? new BundleAnalyzerPlugin() : ''],
};
