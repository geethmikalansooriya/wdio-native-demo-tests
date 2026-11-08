# WebdriverIO Native Demo App: Android UI tests

Automated tests for the sign-up, login and forms screens of the [WebdriverIO Native Demo App v2.2.0](https://github.com/webdriverio/native-demo-app/releases/tag/v2.2.0), on Android.

11 feature tests (4 sign-up, 4 login, 3 forms) plus 1 smoke test, 12 in total. 13 cases are designed in [docs/test-cases.md](docs/test-cases.md) and 11 of them are automated. Every feature test asserts what the user sees: dialog text or error text.

## Quick start

1. Install Node, Android Studio (with an emulator) and set `JAVA_HOME` and `ANDROID_HOME` ([Prerequisites](#prerequisites)).
2. Download the APK into `apps/` ([Get the APK](#get-the-apk)).
3. `npm ci` ([Setup and run](#setup-and-run)).
4. Start the emulator and check `adb devices` shows it as `device` ([Setup and run](#setup-and-run)).
5. `npm test` ([Setup and run](#setup-and-run)).

## Prerequisites

| What | Notes |
|------|-------|
| Node.js | Developed on Node 24.22.2 (npm 11.19.1). Other versions untested. |
| Android Studio | With the Android SDK and an emulator (AVD). |
| JDK | Appium needs Java to check the APK signature. JDK 17 is the commonly recommended version, but I only tested JDK 25 (the one bundled with Android Studio). JDK 17 is untested. |
| `JAVA_HOME` and `ANDROID_HOME` | Must be set. |

macOS example (adjust the paths for your machine):

```sh
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export ANDROID_HOME="$HOME/Library/Android/sdk"
```

Without Java, the run stops with "Unable to locate a Java Runtime".

**Tested on:** macOS (Apple silicon), Android 17 emulator `sdk_gphone64_arm64`. Not tested: Windows, Linux, real devices, other Android versions.

### Get the APK

The APK is 118 MB, so it is not stored in git (`apps/*.apk` is gitignored). Download it once, either way:

- **Browser:** open the [v2.2.0 release page](https://github.com/webdriverio/native-demo-app/releases/tag/v2.2.0), find `android.wdio.native.app.v2.2.0.apk` under Assets, and save it into the `apps/` folder.
- **Terminal:**

```sh
mkdir -p apps
curl -L -o apps/android.wdio.native.app.v2.2.0.apk \
  https://github.com/webdriverio/native-demo-app/releases/download/v2.2.0/android.wdio.native.app.v2.2.0.apk
```

The file must keep this exact name. If it is missing, the run stops immediately with a message telling you where to put it.

## Setup and run

```sh
npm ci                  # installs WebdriverIO, Appium and the UiAutomator2 driver
```

1. Start an Android emulator (Android Studio > Device Manager) and wait until it has booted. `adb devices` should list it as `device`.
2. Make sure port **4723** is free. The Appium server is started and stopped by the test run itself, so don't run your own Appium on that port.
3. Run the tests:

```sh
npm test                # all specs, about 2 to 3 minutes
npm run test:smoke      # only the smoke test, about 15 seconds
npx wdio run wdio.conf.ts --spec test/specs/login.e2e.ts   # one spec file
```

Spec files run **one at a time on purpose** (`maxInstances: 1`). There is one emulator, and a device can only host one Appium session (see Reliability decisions).

Optional environment variables, used only when set:

| Variable | Use |
|----------|-----|
| `PLATFORM_VERSION` | Only accept a device running this Android version, for example `PLATFORM_VERSION=15 npm test`. A version that doesn't match fails with "Unable to find an active device or emulator with OS ...". |
| `UDID` | Pick a device when several are connected, for example `UDID=emulator-5554 npm test`. Get ids from `adb devices`. |

With neither set, Appium uses the one connected device.

Versions are pinned in `package-lock.json`.

## Why WebdriverIO + Appium + TypeScript

- **Readable async code.** `async/await` reads like the steps a user takes.
- **Accessibility-id locators.** The app exposes ids like `input-email` and `button-LOGIN`, which are stable and meant for testing. Only the validation messages have no id, and they are found by exact text.
- **Built-in waits.** Commands like `waitForDisplayed` and retrying assertions like `toHaveText` remove any need for fixed sleeps.
- **A path to iOS.** The same page objects and specs could in principle run against the iOS build with a different capability set. Not attempted.
- Mocha is used as the test runner, with the spec reporter. No Cucumber.

## Project structure

```
wdio.conf.ts              WebdriverIO + Appium configuration (capabilities, one worker, APK check)
test/
  config.ts               shared constants (app package id)
  pageobjects/
    SignUpPage.ts         sign-up form: locators and actions
    LoginPage.ts          login form: locators and actions
    FormsPage.ts          forms screen: input, switch, Active button
    NativeAlert.ts        the native Android dialog (message and OK), shared by all specs
  specs/
    smoke.e2e.ts          app launches and shows the Login tab
    signup.e2e.ts         SU-01, SU-02, SU-03, SU-06
    login.e2e.ts          LG-01, LG-02, LG-03, LG-05
    forms.e2e.ts          FM-01, FM-02, FM-03
docs/
  test-cases.md           every test case with exact texts, locators, observations, and automated yes/no
  screenshots/            evidence for the bug report
BUGS.md                   bug report
CLAUDE.md                 working rules given to the AI assistant (see AI use)
apps/                     put the APK here (gitignored)
```

Specs contain no locators. Page objects hold the locators and small named actions, so a changed id or message is fixed in one place.

## Test design

IDs follow [docs/test-cases.md](docs/test-cases.md), which marks which cases are automated.

**Required scenarios (from the brief), all automated**

| Area | Tests |
|------|-------|
| Sign up | SU-01 success dialog "You successfully signed up!", SU-02 invalid email rejected, SU-03 mismatched passwords rejected |
| Login | LG-01 success dialog "You are logged in!", LG-02 invalid email rejected, LG-03 password shorter than 8 characters rejected |
| Forms | FM-01 typed text is echoed, FM-02 switch toggles and its label updates (both states checked), FM-03 Active button opens the alert "This button is active" |

**Extras I added**

- **SU-06 and LG-05: all fields empty.** Leaving a form empty is the most common real-world mistake. It also proves that all validation rules fire together, which a single bad field cannot show.

**Not automated**

- **SU-04 (7-character password that matches the confirm field).** The app shows an extra, wrong error here (see Known issue). A test would either fail today or lock in the wrong behaviour, so it is covered by the bug report instead.
- **LG-04 (login with exactly 8 characters).** Designed, but cut to keep the suite small, in line with the brief's "a few reliable, readable tests are worth more than many flaky ones".

## Reliability decisions

- **Fresh app launch before every test.** The app keeps validation errors on screen until the next button press, so each test relaunches the app. That keeps tests independent of each other and of their order.
- **Explicit waits only.** There is no `pause()` or fixed sleep. Tests wait for an element or for text to match, then move on.
- **Assert the error, then assert the others are absent.** In negative tests I wait for the expected error first, so the "not displayed" checks cannot pass before the app has validated.
- **One spec file at a time.** By default WebdriverIO runs spec files in parallel, and four Appium sessions fought over one emulator: the full suite failed 5 out of 5 times even though each spec passed alone. `maxInstances: 1` fixed it, and the suite then passed 3 out of 3 times.
- **Missing-APK check.** If the APK is not in `apps/`, `wdio.conf.ts` stops at start-up with a message and the download link (checked in a fresh clone).

All results are from my own machine.

## Known issue

[BUGS.md](BUGS.md) documents BUG-01: with a matching 7-character password, sign-up shows "Please enter the same password" even though both fields match. Related observation (not filed as a bug, noted in docs/test-cases.md): after a failed press, correcting the inputs does not clear the old errors until the next press.

## What I would do next

- GitHub Actions CI that boots an Android emulator and runs the suite on every push.
- An iOS capability set and iOS-specific error-text locators.
- Screenshot on failure, attached to the test report.
- An Allure report in place of the console-only spec reporter.
- More emulators or devices, with parallel workers (the current single-worker limit is about one emulator, not about the tests).
- A small test-data factory for emails and passwords (today the values are written in each test).
- Speed: starting a session (APK install) and typing take most of the time in a run.

## AI use

I used Claude Code throughout, to help scaffold the project and write the page objects, specs and docs, one step at a time with a commit after each step. The rules I gave it are in [CLAUDE.md](CLAUDE.md). I reviewed the code, ran the tests myself, and verified the locators and texts against the real app.
