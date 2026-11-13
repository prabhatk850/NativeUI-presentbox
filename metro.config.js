const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

try {
  process.loadEnvFile();
} catch {}

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // babel.config.js inlines the Contentful token; a changed token must rebuild, not reuse cached files
  cacheVersion: process.env.CONTENTFUL_DELIVERY_TOKEN ?? '',
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
