import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import reactNativeWeb from 'vite-plugin-react-native-web';

// Web build of the same app: react-native is aliased to react-native-web by the plugin.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'CONTENTFUL_');
  return {
    plugins: [react(), reactNativeWeb()],
    resolve: {
      // react-native-svg imports the native asset registry; react-native-web ships the same API
      alias: { '@react-native/assets-registry/registry': 'react-native-web/dist/modules/AssetRegistry' },
    },
    // same rule as babel.config.js: only the read-only delivery token goes into the bundle
    define: { 'process.env.CONTENTFUL_DELIVERY_TOKEN': JSON.stringify(env.CONTENTFUL_DELIVERY_TOKEN ?? '') },
    build: { outDir: 'dist-web' },
  };
});
