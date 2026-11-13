// Values from .env that may ship inside the app bundle. Only the read-only Contentful delivery token:
// never add CONTENTFUL_MANAGEMENT_TOKEN, it can rewrite the whole space. Vite does the same in vite.config.mjs.
const PUBLIC_ENV = ['CONTENTFUL_DELIVERY_TOKEN'];

// replaces process.env.NAME with its value at build time (Metro has no env support of its own)
const inlineEnv = ({ types: t }) => ({
  visitor: {
    MemberExpression(path) {
      const name = PUBLIC_ENV.find((n) => path.matchesPattern(`process.env.${n}`));
      if (name) path.replaceWith(t.stringLiteral(process.env[name] ?? ''));
    },
  },
});

module.exports = (api) => {
  // Jest skips .env so tests run on src/mocks; a test that wants Contentful sets process.env itself
  const test = api.env('test');
  if (!test) {
    try {
      process.loadEnvFile();
    } catch {} // no .env: no token, the app runs on src/mocks
  }
  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: test ? [] : [inlineEnv],
  };
};
