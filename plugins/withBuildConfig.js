const { withAppBuildGradle, withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

// Fix 1: Enable BuildConfig generation in app/build.gradle
function withBuildConfigGradle(config) {
  return withAppBuildGradle(config, (config) => {
    const gradle = config.modResults.contents;
    if (gradle.includes('buildConfig = true') || gradle.includes('buildConfig true')) {
      return config;
    }
    config.modResults.contents = gradle.replace(
      /android\s*\{/,
      `android {\n    buildFeatures {\n        buildConfig = true\n    }`
    );
    return config;
  });
}

// Fix 2: Correct wrong package declaration in MainActivity.kt and MainApplication.kt
function withFixPackageDeclaration(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const packageName = config.android?.package ?? '';
      if (!packageName) return config;

      const appDir = path.join(
        config.modRequest.platformProjectRoot,
        'app', 'src', 'main', 'java',
        ...packageName.split('.')
      );

      const files = ['MainActivity.kt', 'MainApplication.kt'];

      for (const file of files) {
        const filePath = path.join(appDir, file);
        if (!fs.existsSync(filePath)) continue;

        let content = fs.readFileSync(filePath, 'utf8');
        // Replace any wrong package declaration with the correct one
        content = content.replace(
          /^package\s+[\w.]+/m,
          `package ${packageName}`
        );
        fs.writeFileSync(filePath, content, 'utf8');
      }

      return config;
    },
  ]);
}

module.exports = function withBuildConfig(config) {
  config = withBuildConfigGradle(config);
  config = withFixPackageDeclaration(config);
  return config;
};
