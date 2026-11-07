import { $, driver } from '@wdio/globals';

class LoginPage {
    get loginTab() {
        return $('~Login');
    }

    get loginSwitch() {
        return $('~button-login-container');
    }

    get emailInput() {
        return $('~input-email');
    }

    get passwordInput() {
        return $('~input-password');
    }

    get loginButton() {
        return $('~button-LOGIN');
    }

    // The error messages have no accessibility id, so we find them by their exact text.
    get emailError() {
        return $('android=new UiSelector().text("Please enter a valid email address")');
    }

    get passwordError() {
        return $('android=new UiSelector().text("Please enter at least 8 characters")');
    }

    // Bottom Login tab, then the "Login" switch inside the screen.
    async open() {
        await this.loginTab.waitForDisplayed();
        await this.loginTab.click();
        await this.loginSwitch.waitForDisplayed();
        await this.loginSwitch.click();
        await this.loginButton.waitForDisplayed();
    }

    async fillForm(email: string, password: string) {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
    }

    async tapLogin() {
        // The keyboard can cover the button, so close it first if it is open.
        if (await driver.isKeyboardShown()) {
            await driver.hideKeyboard();
        }
        await this.loginButton.click();
    }
}

export default new LoginPage();
