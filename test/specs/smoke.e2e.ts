import { $, expect } from '@wdio/globals';

describe('Smoke', () => {
    it('launches the app and shows the Login tab', async () => {
        const loginTab = $('~Login');

        await loginTab.waitForDisplayed();
        await expect(loginTab).toBeDisplayed();
    });
});
