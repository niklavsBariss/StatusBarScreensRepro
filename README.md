> May be deleted when [software-mansion/react-native-screens#5137](https://github.com/software-mansion/react-native-screens/issues/5137) is no longer open.

# react-native-screens: wrong status bar style on cold launch

On RN 0.88 with `UIViewControllerBasedStatusBarAppearance = YES` (the template default), the status bar style should come from `RCTStatusBarAppearance`, which JS `<StatusBar>` sets. react-native-screens swizzles `childViewControllerForStatusBarStyle/Hidden` on every `UIViewController`, so UIKit asks the top `RNSScreen` instead. With no `statusBarStyle` set, that screen answers `Auto`, and `Auto` resolves against `UITraitCollection.currentTraitCollection`. On a cold launch that is the system theme, not the window's `overrideUserInterfaceStyle` (forced light here by `Appearance.setColorScheme('light')`).

## Steps

1. `npm install && cd ios && pod install`
2. Set the simulator to dark appearance: `xcrun simctl ui <udid> appearance dark`.
3. Build Release (JS embedded, no Metro): `xcodebuild -workspace ios/StatusBarScreensRepro.xcworkspace -scheme StatusBarScreensRepro -configuration Release -sdk iphonesimulator -destination 'id=<udid>' build`, then `xcrun simctl install`.
4. Cold launch: `xcrun simctl terminate <udid> org.reactjs.native.example.StatusBarScreensRepro; xcrun simctl launch <udid> org.reactjs.native.example.StatusBarScreensRepro`.

**Expected:** dark status bar text, as set by `<StatusBar barStyle="dark-content" />`.
**Actual:** white status bar text.

The background is grey so that white text, dark text and a hidden status bar can be told apart.
It doesn't recover when the system theme changes at runtime: the scene keeps the style from launch.

## A/B

`USE_SCREENS` in `App.tsx` is passed to `detachInactiveScreens` on the stack navigator. With `USE_SCREENS = false` the stack renders plain views, no `RNSScreen` becomes a child of the root view controller, and the text is dark. `enableScreens(false)` is not an alternative: `@react-navigation/stack` passes `enabled={detachInactiveScreens}` to each screen, which overrides it.

| `USE_SCREENS = true`                                | `USE_SCREENS = false`                                 |
| --------------------------------------------------- | ----------------------------------------------------- |
| ![screens on](screenshots/screens-on-cold-dark.png) | ![screens off](screenshots/screens-off-cold-dark.png) |

## Versions

- react-native 0.88.1 (template, `SceneDelegate`)
- react-native-screens 4.30.1
- @react-navigation/native 7.5.1, @react-navigation/stack 7.12.1
- react-native-gesture-handler 3.4.0, react-native-safe-area-context 5.11.1
- Xcode 27.1 (27A9275), iOS 27.0 simulator (iPhone 18 Pro)
