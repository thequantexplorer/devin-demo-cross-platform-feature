# Parks app

A small Expo (SDK 58) app written in TypeScript. It lists national parks.

- Install: `npm ci`
- Tests: `npm test`
- Type check: `npm run typecheck`
- Add packages with `npx expo install <package>`, not `npm install`, so versions match the Expo SDK.
- The app runs in Expo Go. Do not add packages that need a custom native build.
- `src/api/server.ts` and `src/api/network.ts` fake the backend and the network. Do not replace them with real network calls.
- To run the app on the Android emulator or the iOS Simulator, use the `test-on-phones` skill in `.agents/skills/test-on-phones/SKILL.md`.
