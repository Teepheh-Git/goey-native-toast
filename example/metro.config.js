const path = require("path");
const { getDefaultConfig } = require("@expo/metro-config");
const { withMetroConfig } = require("react-native-monorepo-config");

const root = path.resolve(__dirname, "..");
const pkg = require("../package.json");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = withMetroConfig(getDefaultConfig(__dirname), {
  root,
  dirname: __dirname,
});

// Force resolution of the library to the source code
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  [pkg.name]: path.resolve(__dirname, "..", "src"),
};

// Ensure we watch the root directory
config.watchFolders = [...(config.watchFolders || []), root];

module.exports = config;
