import { driver, expect } from '@wdio/globals';
import { APP_ID } from '../config';
import FormsPage from '../pageobjects/FormsPage';
import NativeAlert from '../pageobjects/NativeAlert';

describe('Forms', () => {
    // A fresh launch gives every test the initial state (empty input, switch off).
    beforeEach(async () => {
        await driver.terminateApp(APP_ID);
        await driver.activateApp(APP_ID);
        await FormsPage.open();
    });

    it('FM-01 echoes the typed text', async () => {
        await FormsPage.typeText('Hello QA');

        // toHaveText keeps checking until the text matches or the timeout ends.
        await expect(FormsPage.typedText).toHaveText('Hello QA');
    });

    it('FM-02 toggles the switch and updates its label', async () => {
        await expect(FormsPage.switchLabel).toHaveText('Click to turn the switch ON');

        await FormsPage.tapSwitch();
        await expect(FormsPage.switchLabel).toHaveText('Click to turn the switch OFF');

        await FormsPage.tapSwitch();
        await expect(FormsPage.switchLabel).toHaveText('Click to turn the switch ON');
    });

    it('FM-03 opens an alert when the Active button is tapped', async () => {
        await FormsPage.tapActive();

        expect(await NativeAlert.getMessage()).toBe('This button is active');
        await NativeAlert.accept();
    });
});
