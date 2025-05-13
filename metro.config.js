// filepath: metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  defaultConfig.resolver = defaultConfig.resolver || {};
  defaultConfig.resolver.extraNodeModules = defaultConfig.resolver.extraNodeModules || {};

  if (process.env.EXPO_PLATFORM === 'web') {
    console.log('Applying web-specific Metro configuration for codegenNativeCommands...');
    const mockEmptyModulePath = path.resolve(__dirname, './mock-empty.js');
    defaultConfig.resolver.extraNodeModules['react-native/Libraries/Utilities/codegenNativeCommands'] = mockEmptyModulePath;
  }

  // Regarding the 'ws' and 'events' issue:
  // First, run `npm ls ws` or `yarn why ws` to find out which package is importing 'ws'.
  // If it's related to Supabase, ensure your `supabase-js` is up-to-date and
  // check Supabase docs for React Native/Expo specific configurations.
  // Avoid bundling Node.js-specific modules like 'ws' for the client.
  // A polyfill is a last resort, e.g., by installing 'eventemitter3' (`npm install eventemitter3`)
  // and uncommenting the line below:
  // defaultConfig.resolver.extraNodeModules.events = require.resolve('eventemitter3');

  return defaultConfig;
})();