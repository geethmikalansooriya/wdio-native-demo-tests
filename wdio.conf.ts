import path from 'node:path';

// Both can be overridden: DEVICE_NAME="Pixel_8" PLATFORM_VERSION=15 npm test
const deviceName = process.env.DEVICE_NAME ?? 'sdk_gphone64_arm64';
const platformVersion = process.env.PLATFORM_VERSION ?? '17';

export const config: WebdriverIO.Config = {
    runner: 'local',
    specs: ['./test/specs/**/*.e2e.ts'],

    // Appium service starts and stops the Appium server for us.
    services: [['appium', { args: { port: 4723 } }]],
    port: 4723,

    capabilities: [
        {
            platformName: 'Android',
            'appium:automationName': 'UiAutomator2',
            'appium:deviceName': deviceName,
            'appium:platformVersion': platformVersion,
            'appium:app': path.join(process.cwd(), 'apps', 'android.wdio.native.app.v2.2.0.apk'),
        },
    ],

    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        timeout: 60000,
    },

    // Upper limit for finding elements; tests still move on as soon as the element appears.
    waitforTimeout: 10000,
};
