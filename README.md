# HC CVT App


[![made with expo](https://img.shields.io/badge/MADE%20WITH%20EXPO-000.svg?style=for-the-badge&logo=expo&labelColor=4630eb&logoWidth=20)](https://github.com/expo/expo) [![supports iOS and Android](https://img.shields.io/badge/Platforms-Native-4630EB.svg?style=for-the-badge&logo=EXPO&labelColor=000&logoColor=fff)](https://github.com/expo/expo)

### Technical Notes

- Expo SDK 40
- React Native 0.63.2
- React Navigation v5
- React Native Paper v4
- iOS 13 Appearance Support (with [react-native-appearance](https://github.com/expo/react-native-appearance))
- Preloading/caching local assets
- Checker for the iOS notch: iPhoneX, iPhoneXs, iPhoneXr, iPhoneXs Max

## Table of Contents

- [install](#install)
- [development on a physical device](#development-on-a-physical-device)
- [linting](#linting)
- [helpful links](#helpful-links)
- [device learnings](#device-learnings)
- [demo & release notes](#demo-and-release-notes)

## install

First, make sure you have Expo CLI installed: `npm install -g expo-cli`

Install: `yarn` or `yarn install`

Run Project Locally: `expo start`

## development on a physical device

- first, your machine and physical device should be on the same wifi connection
- make sure you have Expo CLI installed globally, if not run:
  - `npm install -g expo-cli`
- then navigate to this project's directory on your machine and run:
  - `expo start`
- now download the Expo Client app on your preferred physical device:
  - **Android:** [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - **Apple:** [App Store](https://itunes.apple.com/us/app/expo-client/id982107779)
- scan the QR code generated when this project build started (expo start)
  - **android users:** the QR scanner is built within the Expo Client app! 🤗
  - **ios 11 and later:** you can open your camera app to scan the QR code, apple made the Expo folks remove the QR scanner from the app for some reason... 🤔
  - **ios 10 and below:** work around to [get expo running on older iOS devices](https://blog.calebnance.com/expo/getting-expo-to-work-on-older-iphones-with-no-qr-support.html)
- having issues? check the [installation page](https://docs.expo.io/versions/latest/introduction/installation) for any pitfalls you may have.

## linting

- run: `yarn lint` for a list of linting warnings/error in cli
- prettier and airbnb config
- make sure you have prettier package installed:
  - [prettier for atom](https://atom.io/packages/prettier-atom)
  - [prettier for vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- then make sure to enable these options (packages → prettier):
  - eslint integration
  - stylelint integration
  - automatic format on save (toggle format on save)
- be aware of the `.prettierignore` file

## helpful links

- [using nvm](https://davidwalsh.name/nvm)
- [setup prettier/eslint within project](https://blog.echobind.com/integrating-prettier-eslint-airbnb-style-guide-in-vscode-47f07b5d7d6a)

## device learnings

- **ios:** The notch on iPhoneX, iPhoneXs, iPhoneXr, iPhoneXs Max is **30pt** from top

## demo and release notes

### version: 0.0.3 (current)

HC CVT App - prototype

- added user preference for en-CA/fr-CA
- removed react-native-svg
- upgraded to [React Navigation v5](https://reactnavigation.org/docs/upgrading-from-4.x/)
- introduced cross platform Material Design UI toolkit [React Native Paper](https://reactnativepaper.com/)
- TODO: add themes - React Native Paper, React Navigation Theme Support / Example Usage ([themes docs](https://reactnavigation.org/docs/themes))

### version: 0.0.2

this starter originally from [expo-multi-screen-starter](https://github.com/calebnance/expo-multi-screen-starter), by Caleb Nance
