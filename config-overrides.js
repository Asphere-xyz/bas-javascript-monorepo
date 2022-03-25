const {
  removeModuleScopePlugin,
  override,
  babelInclude,
} = require('customize-cra');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const paths = require('react-scripts/config/paths.js');

module.exports = function (config) {
  const esLintPluginOptions = config.plugins.splice(-1)[0].options;

  config.plugins.push(
    new ESLintPlugin({
      ...esLintPluginOptions,
      exclude: [],
      context: path.resolve(paths.appPath + '/..'),
    }),
  );

  return override(
    removeModuleScopePlugin(),
    babelInclude([
      path.resolve('src'),
      path.resolve('../javascript-sdk'),
      path.resolve('../staking-ui'),
    ]),
  )(config);
};
