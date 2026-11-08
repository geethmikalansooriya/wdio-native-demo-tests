import fs from 'node:fs';
import path from 'node:path';

const apkPath = path.join(process.cwd(), 'apps', 'android.wdio.native.app.v2.2.0.apk');

// The APK is not stored in git, so stop early with a clear message if it is missing.
// This runs while the config loads. (An error thrown inside an onPrepare hook is only logged and the run goes on.)
if (!fs.existsSync(apkPath)) {
    throw new Error(
        `APK not found at ${apkPath}. Download android.wdio.native.app.v2.2.0.apk from ` +
            'https://github.com/webdriverio/native-demo-app/releases/tag/v2.2.0 and put it in the apps/ folder.',
    );
}

const androidCapabilities: WebdriverIO.Capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:app': apkPath,
};

// Optional. Without them Appium uses the one connected device or emulator.
//   PLATFORM_VERSION=14 npm test    only use a device running Android 14
//   UDID=emulator-5554 npm test     pick a device when several are connected (see `adb devices`)
if (process.env.PLATFORM_VERSION) {
    androidCapabilities['appium:platformVersion'] = process.env.PLATFORM_VERSION;
}
if (process.env.UDID) {
    androidCapabilities['appium:udid'] = process.env.UDID;
}

export const config: WebdriverIO.Config = {
    runner: 'local',
    // New spec files must be added here by hand. Order follows the brief.
specs: [
    './test/specs/smoke.e2e.ts',
    './test/specs/signup.e2e.ts',
    './test/specs/login.e2e.ts',
    './test/specs/forms.e2e.ts',
],

    // One emulator can only run one Appium session, so run one spec file at a time.
    maxInstances: 1,

    // Appium service starts and stops the Appium server for us.
    services: [['appium', { args: { port: 4723 } }]],
    port: 4723,

    capabilities: [androidCapabilities],

    framework: 'mocha',
    reporters: ['spec'],
    // Only warnings and errors, so the test results stay readable.
    logLevel: 'warn',
    mochaOpts: {
        timeout: 60000,
    },

    // Upper limit for finding elements; tests still move on as soon as the element appears.
    waitforTimeout: 10000,
};
