import { $ } from '@wdio/globals';

class FormsPage {
    get formsTab() {
        return $('~Forms');
    }

    get textInput() {
        return $('~text-input');
    }

    // The "You have typed:" area that echoes the input.
    get typedText() {
        return $('~input-text-result');
    }

    get switchToggle() {
        return $('~switch');
    }

    // The text next to the switch, for example "Click to turn the switch ON".
    get switchLabel() {
        return $('~switch-text');
    }

    get activeButton() {
        return $('~button-Active');
    }

    // Bottom Forms tab, then wait until the screen has loaded.
    async open() {
        await this.formsTab.waitForDisplayed();
        await this.formsTab.click();
        await this.textInput.waitForDisplayed();
    }

    async typeText(text: string) {
        await this.textInput.setValue(text);
    }

    async tapSwitch() {
        await this.switchToggle.click();
    }

    async tapActive() {
        await this.activeButton.click();
    }
}

export default new FormsPage();
