# Running RealPage Master on an iPhone 15

The app is an Expo (React Native) project, so the same code runs as a native iPhone app. Pick one
of the three routes below.

| Route | What you need | Result |
| --- | --- | --- |
| A. Expo Go | Free. A Windows PC and the iPhone on the same Wi-Fi. | The app runs inside the Expo Go app while your PC runs `npx expo start`. Best for trying changes. |
| B. Install build (ad hoc) | Apple Developer Program ($99/year) and a free Expo account. | A real app icon on your home screen that runs on its own, offline. |
| C. TestFlight | Same as B. | Installed and updated through Apple's TestFlight app. |

Everything the app shows is inside the app bundle: the 7,107-screen RealPage catalog, all 99 ASC
cards, the complete official Codification text and the FASB glossary. Once installed (B or C) it
works with no internet connection. Your checklist progress, notes, study progress and ☆ saved
Topics are stored on the phone only. They are not synced to the web version, and deleting the app
deletes them.

## A. Expo Go (quick test, no Apple account)

1. On the iPhone, install **Expo Go** from the App Store.
2. On the PC, in the project folder:

   ```bash
   npm install
   npx expo start
   ```

3. Scan the QR code in the terminal with the iPhone **Camera** app, then tap the banner to open it in
   Expo Go.

If the phone can't connect (office or guest Wi-Fi often blocks it), run `npx expo start --tunnel`
instead. If Expo Go says the project needs a different SDK version, use route B. The App Store
Expo Go only runs the latest Expo SDK, and this project uses SDK 57.

The app stops when the PC stops `expo start`. For an app that runs on its own, use route B or C.

## B. Install build on your iPhone (ad hoc)

One-time setup on the PC:

```bash
npm install -g eas-cli
eas login            # the Expo account named in app.json "owner" (sumitm234), or change "owner"
eas init             # links the project; adds extra.eas.projectId to app.json (commit that change)
```

Register the iPhone 15 (once):

```bash
eas device:create
```

Choose the website option and open the link on the iPhone in **Safari**. Install the profile it
downloads (Settings → Profile Downloaded → Install). This registers the phone's UDID with your Apple
account.

Build and install:

```bash
eas build --platform ios --profile preview
```

The first build asks you to sign in to your Apple Developer account and creates the certificate and
provisioning profile. The build runs on Expo's servers and takes about 15–30 minutes. When it
finishes, open the build link (or scan its QR code) on the iPhone and tap **Install**.

On iOS 16 and later, turn on **Developer Mode** before you open the app:
Settings → Privacy & Security → Developer Mode → On. The phone restarts.

To update the app, run the same `eas build` command again and install the new build over the old
one. Your progress is kept.

## C. TestFlight

```bash
eas build --platform ios --profile production
eas submit --platform ios --latest
```

`eas submit` creates the app in App Store Connect the first time and uploads the build. After Apple
finishes processing (usually 10–30 minutes), add yourself as an internal tester under App Store
Connect → your app → TestFlight. Then install **TestFlight** from the App Store and open the
invitation. Internal testing needs no App Review. A TestFlight build expires after 90 days, so
rebuild and resubmit before then. `production` increments the build number automatically.

## Before the first build

- **Bundle identifier.** `app.json` → `ios.bundleIdentifier` is `com.sumitm234.propertyaccounting`.
  Change it before the first build if you want a different one. Once App Store Connect has an app
  with that ID, it is fixed.
- **App name.** The name "RealPage Master" is fine for your own ad hoc and TestFlight builds.
  Public App Store review can reject names that use another company's trademark.
- **Push updates without reinstalling (optional).** `expo-updates` is already installed. Run
  `eas update:configure` once and make a new build. After that, `eas update --branch preview`
  (or `production`) sends content changes, such as new cards or fixes, to the installed app. Changes
  to native modules or app.json still need a new build.

## What was checked for the iPhone 15

- `npx expo export --platform ios` compiles the whole app, including all ASC data, to Hermes bytecode
  with no errors.
- At the iPhone 15 size (393 × 852 points), these were checked in the browser build: the Codex list,
  the cards, the Official Text tab with tappable terms, glossary search, study mode (overview, a
  session, the "Drill these traps" round trip), ☆ saved Topics, ASC results in Triage & Search, and
  the GAAP button in the Close Cockpit. No layout overflowed and the console showed no errors.
- The layout keeps clear of the Dynamic Island and the home indicator (safe-area insets). The app is
  portrait-only and dark-themed. The study answer buttons sit above the tab bar, within thumb reach.
