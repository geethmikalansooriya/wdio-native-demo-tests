# Test cases

All texts below were observed in the real app (v2.2.0, Android 17 emulator) through the Appium driver, not guessed.
Test data: email `test@example.com`, password `password123` (11 chars).
"Automated" is `no` until the spec exists; it is flipped to `yes` as each step is finished.

Behaviour that shapes the tests:
- Validation runs when the LOGIN / SIGN UP button is pressed, not while typing.
- Several errors can show at once, each under its own field.
- Errors stay on screen after the input is corrected, until the next button press.
- Success and the Active button show a native Android alert with one `OK` button and no title.

## Required scenarios (from the assignment)

| ID | Screen | Type | Steps | Expected result | Automated |
|----|--------|------|-------|-----------------|-----------|
| SU-01 | Sign up | positive | Login tab > Sign up. Enter `test@example.com`, password `password123`, confirm `password123`. Press SIGN UP. | Alert with message "You successfully signed up!" and an OK button. |yes |
| SU-02 | Sign up | negative | Login tab > Sign up. Enter `abc`, password `password123`, confirm `password123`. Press SIGN UP. | Error "Please enter a valid email address" under the email field. No other errors. No alert. |yes |
| SU-03 | Sign up | negative | Login tab > Sign up. Enter `test@example.com`, password `password123`, confirm `password124`. Press SIGN UP. | Error "Please enter the same password" under the confirm field. No other errors. No alert. |yes |
| LG-01 | Login | positive | Login tab > Login. Enter `test@example.com`, password `password123`. Press LOGIN. | Alert with message "You are logged in!" and an OK button. | yes |
| LG-02 | Login | negative | Login tab > Login. Enter `abc`, password `password123`. Press LOGIN. | Error "Please enter a valid email address" under the email field. No other errors. No alert. | yes |
| LG-03 | Login | negative | Login tab > Login. Enter `test@example.com`, password `1234567` (7 chars). Press LOGIN. | Error "Please enter at least 8 characters" under the password field. No other errors. No alert. | yes |
| FM-01 | Forms | positive | Forms tab. Type `Hello QA` into the input field. | The "You have typed:" line shows `Hello QA`. | yes |
| FM-02 | Forms | positive | Forms tab. Note the label ("Click to turn the switch ON"). Tap the switch. Tap it again. | After the first tap the label reads "Click to turn the switch OFF" and the switch is on. After the second tap the label reads "Click to turn the switch ON" and the switch is off. | yes |
| FM-03 | Forms | positive | Forms tab. Press the Active button. | Alert with message "This button is active" and an OK button. | yes |

## Extra scenarios

| ID | Screen | Type | Steps | Expected result | Automated |
|----|--------|------|-------|-----------------|-----------|
| LG-04 | Login | boundary | Login tab > Login. Enter `test@example.com`, password `12345678` (exactly 8 chars). Press LOGIN. | Alert "You are logged in!". 8 characters is accepted, 7 is not (LG-03). | no |
| LG-05 | Login | negative | Login tab > Login. Leave both fields empty. Press LOGIN. | Both errors show at once: "Please enter a valid email address" and "Please enter at least 8 characters". No alert. | yes |
| SU-04 | Sign up | negative | Login tab > Sign up. Enter `test@example.com`, password `1234567` (7 chars), confirm `1234567`. Press SIGN UP. | Error "Please enter at least 8 characters" under the password field. No alert. See observation 1 below about a second error. |no (see BUG-01) |
| SU-06 | Sign up | negative | Login tab > Sign up. Leave all three fields empty. Press SIGN UP. | All three errors show at once: "Please enter a valid email address", "Please enter at least 8 characters" and "Please enter the same password". No alert. | yes |

## Observations from inspection

1. **Possible app bug (SU-04):** with a 7-character password that matches the confirm field exactly, the app shows "Please enter at least 8 characters" and also "Please enter the same password". The passwords do match, so the second message is misleading. SU-04 is therefore not automated. It is written up as BUG-01 in [BUGS.md](../BUGS.md).
2. **Stale errors:** after a failed press, correcting the inputs does not remove the old errors. They clear only on the next press. The tests don't depend on this, but it's worth reporting.
3. **Empty sign-up form:** shows all three errors at once (email, password length, same password).
4. **Emails rejected:** `abc` and `a@b` (no domain dot). Both give "Please enter a valid email address".
5. **No title on any alert:** only a message and OK, so tests assert the message text.

## Locators found (accessibility id unless noted)

| Screen | Element | Locator |
|--------|---------|---------|
| Tab bar | Login tab / Forms tab | `~Login` / `~Forms` |
| Login screen | Screen container | `~Login-screen` |
| Login screen | Switch to Login form / Sign up form | `~button-login-container` / `~button-sign-up-container` |
| Login + Sign up | Email, Password inputs | `~input-email`, `~input-password` |
| Sign up | Confirm password input | `~input-repeat-password` |
| Login / Sign up | Submit buttons | `~button-LOGIN` / `~button-SIGN UP` |
| Forms screen | Screen container | `~Forms-screen` |
| Forms | Text input, echoed text | `~text-input`, `~input-text-result` |
| Forms | Switch, its label | `~switch`, `~switch-text` |
| Forms | Dropdown (not in scope) | `~Dropdown` |
| Forms | Buttons | `~button-Active`, `~button-Inactive` |
| Native alert | Message, OK button | `id=android:id/message`, `id=android:id/button1` |
| Validation errors | Error texts | **No accessibility id and no resource-id.** Must be found by exact text, for example `android=new UiSelector().text("Please enter a valid email address")`. |
