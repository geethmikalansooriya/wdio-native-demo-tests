import { $ } from '@wdio/globals';

// The native Android dialog that the app shows after sign-up, login and the Active button.
// It has no title, only a message and an OK button.
class NativeAlert {
    get message() {
        return $('id=android:id/message');
    }

    get okButton() {
        return $('id=android:id/button1');
    }

    // The dialog takes about a second to appear, so wait for it before reading the text.
    async getMessage(): Promise<string> {
        await this.message.waitForDisplayed({ timeout: 5000 });
        return this.message.getText();
    }

    async accept() {
        await this.okButton.click();
    }
}

export default new NativeAlert();
