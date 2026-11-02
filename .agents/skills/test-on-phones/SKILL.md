---
name: test-on-phones
description: Run this Expo app on the Android emulator and the iOS Simulator, and record the offline favorites flow on each. Use when asked to test or record the app on Android or iOS.
---

# Test the Parks app on Android and iOS

The app runs in **Expo Go**. You do not need a native build, Xcode project or Gradle.
Run `npm ci` first on every machine.

## Android (on this Linux machine)

1. If there is no Android SDK yet, install it in `$HOME/android-sdk`:
   command-line tools, `platform-tools`, `emulator` and
   `system-images;android-35;google_apis;x86_64`. Create an AVD named `devin`
   with `avdmanager create avd -n devin -k "system-images;android-35;google_apis;x86_64" --device pixel_6`.
   Then give it 2 CPU cores and 3 GB of RAM, or it boots very slowly and shows "isn't responding" dialogs:
   `sed -i 's/^hw.cpu.ncore.*/hw.cpu.ncore = 2/; s/^hw.ramSize.*/hw.ramSize = 3072M/' ~/.android/avd/devin.avd/config.ini`
2. If the emulator says `/dev/kvm` is not usable, run `sudo chmod 666 /dev/kvm`.
3. Start it on the desktop so recordings can see it:
   `DISPLAY=:0 nohup $HOME/android-sdk/emulator/emulator -avd devin -no-audio -no-snapshot -no-boot-anim -gpu swiftshader_indirect > /tmp/emulator.log 2>&1 &`
4. Wait for boot: `adb wait-for-device` then loop until `adb shell getprop sys.boot_completed` prints `1`.
   This takes about 2 minutes. Start it early and do other work meanwhile.
   If a "System UI isn't responding" dialog shows, tap **Wait**.
5. Start the app: `CI=1 npx expo start --android`. This installs Expo Go on the emulator and opens the app.
   Keep this command running in its own shell.

## iOS (in a macOS child session)

The Linux machine cannot run the iOS Simulator. Start a child session with platform `macos`.
Push your branch first, because the child cannot see your local files. Tell the child:

1. Clone the repo, check out your branch, and run `npm ci`.
2. Run `CI=1 npx expo start --ios`. This boots a simulator, installs Expo Go and opens the app.
   If no simulator is booted, run `xcrun simctl boot "iPhone 17"` and `open -a Simulator` first.
3. Record the flow below and send back the recording.

## The flow to record (both platforms)

**Offline mode** is not saved. It is always off when the app starts.
Start the screen recording before step 1. `Syncing…` shows for less than a second, so screenshots often miss it; the video catches it.

1. Turn on the **Offline mode** switch at the top of the screen. Check it is on before you tap any star.
2. Tap the star on **Acadia** and **Arches**. The badge next to "Parks" shows `2 pending`.
3. Turn off **Offline mode**. The badge shows `Syncing…`, then `Synced`.
4. Turn on **Offline mode** again and star **Denali**. The badge shows `1 pending`.
5. Close the app fully, then open it again:
   - Android: `adb shell am force-stop host.exp.exponent`, then
     `adb shell am start -a android.intent.action.VIEW -d "'<the exp:// URL Expo printed>'"`.
   - iOS: `xcrun simctl terminate booted host.exp.Exponent`, then
     `xcrun simctl openurl booted "<the exp:// URL Expo printed>"`.
   All three stars are still there. Offline mode is off again, so the badge ends on `Synced`.

## Tips

- The **Offline mode** switch is part of the app. It fakes losing signal. Do not change the emulator's network.
- If a tap on the switch does not register, tap the "Offline mode" label instead (the whole row toggles it).
- iOS: keep only one simulator booted (`xcrun simctl list devices booted`; shut down extras with `xcrun simctl shutdown <udid>`), or the app may open on a window you are not looking at.
- Expo Go shows a floating gear button that can cover the switch. Add `?__expo_disable_fab=1` to the `exp://` URL when you reopen the app.
- If Metro shows a red error screen, read the Expo terminal output first.
- Keep each recording short: one take of the flow above.
