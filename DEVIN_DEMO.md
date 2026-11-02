# Devin demo: ship one feature to iOS and Android from one prompt

**What it shows:** Devin builds one feature in an Expo app, tests it on the Android emulator, starts a macOS child session to test it on the iOS Simulator, and opens one PR with a recording from each platform.

**Needs:** GitHub

## Set it up

1. Click **Use this template → Create a new repository**, choose your GitHub account or org as the owner, and keep the name `devin-demo-cross-platform-feature`. The prompt below assumes that name. Use the template rather than a fork: pull requests on a fork go to the original repo by default.
2. In Devin, open [**Settings → Connections → GitHub**](https://app.devin.ai/settings/connections/github) and make sure Devin can access the new repository.

You do not need to install anything. Devin sets up the Android emulator and the macOS machine itself.

## Prompt

Start a new Devin session and paste this. Replace `<you>` with your GitHub user or org.

```text
Repo: https://github.com/<you>/devin-demo-cross-platform-feature

Build the feature in docs/specs/offline-favorites.md: offline favorites with a sync badge. Make the failing tests in src/__tests__/offlineFavorites.test.tsx pass without breaking the other tests, and make `npm run typecheck` pass.

Then prove it works on both phones. Follow .agents/skills/test-on-phones/SKILL.md. Push your branch, then start a macOS child session to run the app on the iOS Simulator and record the flow from the spec. While it does that, run the app yourself on the Android emulator and record the same flow. Open one PR and put both recordings in the description, labeled iOS and Android.
```

## What to watch

- Devin runs the tests first and sees 6 fail.
- A second session starts on macOS. Open it from the first session to watch the iOS Simulator.
- In the **Desktop** tab you can watch the Android emulator.

## Done when

- The PR's **CI** check is green.
- The PR description has an iOS recording and an Android recording of the same flow.
