import { driver, expect } from '@wdio/globals';
import { APP_ID } from '../config';
import LoginPage from '../pageobjects/LoginPage';
import NativeAlert from '../pageobjects/NativeAlert';

describe('Login', () => {
    // Errors stay on screen until the next button press, so every test starts
    // from a freshly launched app to stay independent of the previous one.
    beforeEach(async () => {
        await driver.terminateApp(APP_ID);
        await driver.activateApp(APP_ID);
        await LoginPage.open();
    });

    it('LG-01 shows the success alert for valid details', async () => {
        await LoginPage.fillForm('test@example.com', 'password123');
        await LoginPage.tapLogin();

        expect(await NativeAlert.getMessage()).toBe('You are logged in!');
        await NativeAlert.accept();
    });

    it('LG-02 rejects an invalid email', async () => {
        await LoginPage.fillForm('abc', 'password123');
        await LoginPage.tapLogin();

        // Wait for the expected error first. It proves validation has run,
        // so the "not displayed" check below cannot pass too early.
        await expect(LoginPage.emailError).toBeDisplayed();
        await expect(LoginPage.passwordError).not.toBeDisplayed();
    });

    it('LG-03 rejects a password shorter than 8 characters', async () => {
        await LoginPage.fillForm('test@example.com', '1234567');
        await LoginPage.tapLogin();

        await expect(LoginPage.passwordError).toBeDisplayed();
        await expect(LoginPage.emailError).not.toBeDisplayed();
    });

    it('LG-05 shows both errors together when every field is empty', async () => {
        await LoginPage.tapLogin();

        await expect(LoginPage.emailError).toBeDisplayed();
        await expect(LoginPage.passwordError).toBeDisplayed();
    });
});
