import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactNativeWeb from 'vite-plugin-react-native-web';

// Web build of the same app: react-native is aliased to react-native-web by the plugin.
export default defineConfig({
  plugins: [react(), reactNativeWeb()],
  resolve: {
    // react-native-svg imports the native asset registry; react-native-web ships the same API
    alias: { '@react-native/assets-registry/registry': 'react-native-web/dist/modules/AssetRegistry' },
  },
  build: { outDir: 'dist-web' },
});
