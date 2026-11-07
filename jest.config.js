module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // these packages ship untranspiled ESM / Flow
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|lucide-react-native|react-native-svg|react-native-video|react-native-screens|react-native-safe-area-context)/)',
  ],
  moduleNameMapper: {
    '\\.mp4$': '<rootDir>/jest.asset.js',
    // Jest does not transform .mjs; use lucide's CommonJS icon files
    '^lucide-react-native/icons/(.*)$': '<rootDir>/node_modules/lucide-react-native/dist/cjs/icons/$1.js',
  },
  // first run on a cold cache spends seconds transforming node_modules inside the first test
  testTimeout: 30000,
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
