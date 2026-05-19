const { withAndroidManifest } = require('@expo/config-plugins');

const REMOVE = ['android.permission.ACTIVITY_RECOGNITION'];

module.exports = function withRemovePermissions(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    // tools namespace ekle (manifest merger direktifi için gerekli)
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    if (!manifest['uses-permission']) manifest['uses-permission'] = [];

    // Varsa mevcut girişi kaldır
    manifest['uses-permission'] = manifest['uses-permission'].filter(
      (p) => !REMOVE.includes(p.$?.['android:name'])
    );

    // tools:node="remove" direktifi ekle — Gradle merge sırasında kütüphane manifest'inden de kaldırır
    for (const perm of REMOVE) {
      manifest['uses-permission'].push({
        $: { 'android:name': perm, 'tools:node': 'remove' },
      });
    }

    return config;
  });
};
