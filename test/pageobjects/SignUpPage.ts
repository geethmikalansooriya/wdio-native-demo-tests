import { $, driver } from '@wdio/globals';

class SignUpPage {
    get loginTab() {
        return $('~Login');
    }

    get signUpTab() {
        return $('~button-sign-up-container');
    }

    get emailInput() {
        return $('~input-email');
    }

    get passwordInput() {
        return $('~input-password');
    }

    get confirmPasswordInput() {
        return $('~input-repeat-password');
    }

    get signUpButton() {
        return $('~button-SIGN UP');
    }

    // The error messages have no accessibility id, so we find them by their exact text.
    get emailError() {
        return $('android=new UiSelector().text("Please enter a valid email address")');
    }

    get passwordError() {
        return $('android=new UiSelector().text("Please enter at least 8 characters")');
    }

    get confirmPasswordError() {
        return $('android=new UiSelector().text("Please enter the same password")');
    }

    // Bottom Login tab, then the "Sign up" switch inside the screen.
    async open() {
        await this.loginTab.waitForDisplayed();
        await this.loginTab.click();
        await this.signUpTab.waitForDisplayed();
        await this.signUpTab.click();
        await this.signUpButton.waitForDisplayed();
    }

    async fillForm(email: string, password: string, confirmPassword: string) {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.confirmPasswordInput.setValue(confirmPassword);
    }

    async tapSignUp() {
        // The keyboard can cover the button, so close it first if it is open.
        if (await driver.isKeyboardShown()) {
            await driver.hideKeyboard();
        }
        await this.signUpButton.click();
    }
}

export default new SignUpPage();
