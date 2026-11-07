module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    // story decorators are throwaway stages, inline styles are fine there
    { files: ['*.stories.tsx'], rules: { 'react-native/no-inline-styles': 'off' } },
  ],
};
