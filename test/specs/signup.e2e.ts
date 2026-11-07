import { driver, expect } from '@wdio/globals';
import { APP_ID } from '../config';
import SignUpPage from '../pageobjects/SignUpPage';
import NativeAlert from '../pageobjects/NativeAlert';

describe('Sign up', () => {
    // Errors stay on screen until the next button press, so every test starts
    // from a freshly launched app to stay independent of the previous one.
    beforeEach(async () => {
        await driver.terminateApp(APP_ID);
        await driver.activateApp(APP_ID);
        await SignUpPage.open();
    });

    it('SU-01 shows the success alert for valid details', async () => {
        await SignUpPage.fillForm('test@example.com', 'password123', 'password123');
        await SignUpPage.tapSignUp();

        expect(await NativeAlert.getMessage()).toBe('You successfully signed up!');
        await NativeAlert.accept();
    });

    it('SU-02 rejects an invalid email', async () => {
        await SignUpPage.fillForm('abc', 'password123', 'password123');
        await SignUpPage.tapSignUp();

        // Wait for the expected error first. It proves validation has run,
        // so the "not displayed" checks below cannot pass too early.
        await expect(SignUpPage.emailError).toBeDisplayed();
        await expect(SignUpPage.passwordError).not.toBeDisplayed();
        await expect(SignUpPage.confirmPasswordError).not.toBeDisplayed();
    });

    it('SU-03 rejects mismatched passwords', async () => {
        await SignUpPage.fillForm('test@example.com', 'password123', 'password456');
        await SignUpPage.tapSignUp();

        await expect(SignUpPage.confirmPasswordError).toBeDisplayed();
        await expect(SignUpPage.emailError).not.toBeDisplayed();
        await expect(SignUpPage.passwordError).not.toBeDisplayed();
    });

    it('SU-06 shows all three errors together when every field is empty', async () => {
        await SignUpPage.tapSignUp();

        await expect(SignUpPage.emailError).toBeDisplayed();
        await expect(SignUpPage.passwordError).toBeDisplayed();
        await expect(SignUpPage.confirmPasswordError).toBeDisplayed();
    });
});
