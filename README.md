# HPCI CVT App


[![made with expo](https://img.shields.io/badge/MADE%20WITH%20EXPO-000.svg?style=for-the-badge&logo=expo&labelColor=4630eb&logoWidth=20)](https://github.com/expo/expo) [![supports iOS and Android](https://img.shields.io/badge/Platforms-Native-4630EB.svg?style=for-the-badge&logo=EXPO&labelColor=000&logoColor=fff)](https://github.com/expo/expo)

### Technical Notes

- Expo SDK 47
- React Native 0.70.5
- React Navigation v5
- React Native Paper v4
- React Redux v7
- Async Storage v1
- Expo Notifications v0
- Node: >=16.14.2
- Yarn: >=1.22.18

## Table of Contents

- [Install](#install)
- [Development With a Physical Device](#development-with-a-physical-device)
- [Linting](#linting)
- [Device Learnings](#device-learnings)
- [Release Notes](#release-notes)

## Install

First, make sure you have Expo CLI installed: 

Install: 

- `npm install -g expo-cli`
- `yarn` or `yarn install`

Create .env file: copy contents of .env.template and set variables (create in same location)

Run project locally: `npx expo start` or `npx expo start --tunnel`

## Development With a Physical Device

- first, your machine and physical device should be on the same wifi connection
- make sure you have Expo CLI and EAS CLI installed globally, if not run:
  - `npm install -g expo-cli`
  - `npm install -g eas-cli`
- then configure .env: see .env.template
- then navigate to this project's directory on your machine and use the [local CLI](https://blog.expo.dev/the-new-expo-cli-f4250d8e3421) to run:
  - `npx expo start`
- now download the Expo Client app on your preferred physical device:
  - **Android:** [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - **Apple:** [App Store](https://itunes.apple.com/us/app/expo-client/id982107779)
- scan the QR code generated when this project build started (npx expo start)
  - **android:** the QR scanner is built within the Expo Client app
  - **ios 13 and later:** you can open your camera app to scan the QR code
- having issues? check the [installation page](https://docs.expo.dev/get-started/installation/)

## Linting

- run: `npm run lint` or `yarn lint` for a list of linting warnings/error in cli
- prettier and airbnb config
- make sure you have [prettier for vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) installed
- then make sure to enable these options (packages → prettier):
  - eslint integration
  - stylelint integration
- be aware of the `.prettierignore` file

## Device Learnings

- **ios:** The notch on iPhoneX, iPhoneXs, iPhoneXr, iPhoneXs Max is **30pt** from top

## Release Notes

**HPCI CVT App - Update 0.0.47**

### _Steps to update local dev env_
````
# sign in with your expo developer account (i.e. not the expo owner)
# verify expo login:
> expo whoami
# get latest from git
# point env to target PN service
# update expo-cli:
> npm install -g expo-cli
# update eas-cli if running local builds:
> npm install -g eas-cli
# if directed, install npm as instructed
# update yarn:
> npm install -g yarn
# check files:
> yarn --checkFiles
# or remove node_modules and run:
> yarn install
# clean on first start:
> npx expo start -c
# if using, update Expo Go app on device
# scan the QR code with Expo Go (Android) or the Camera app (iOS)
````

### December 21, 2022; version: 0.0.47

- **upgraded to [Expo SDK 47](https://blog.expo.dev/expo-sdk-47-a0f6f5c038af)**
  - React Native updated from 0.69.6 to 0.70.5
  - react and react-dom both updated from 18.0.0 to 18.1.0
  - removed android.useNextNotificationsApi from app.json

### November 28, 2022; version: 0.0.46

- **upgraded to [Expo SDK 46](https://blog.expo.dev/expo-sdk-46-c2a1655f63f7)**
  - React Native updated from 0.68.2 to 0.69.6
  - react and react-dom both updated from 17.0.2 to 18.0.0
  - removed deprecated expo-app-loading
  - switched from using redux's createStore to legacy_createStore
- minor accessiblity/usability improvements

### November 9, 2022; version: 0.0.45

- **upgraded to [Expo SDK 45](https://blog.expo.dev/expo-sdk-45-f4e332954a68)**
  - React Native updated from 0.64.3 to 0.68.2
  - react and react-dom both updated from 17.0.1 to 17.0.2

### May 3, 2022; version: 0.0.44, build 2

- **migrated from Expo Classic Build to EAS Build**
  - added build profiles (eas.json)
  - added publish and build workflows (yml)
  - wrapped MenuDrawer with SafeAreaProvider to resolve padding issue for android
  - installed expo-status-bar and upgraded expo-updates to resolve status bar issues for android

### April 11, 2022; version: 0.0.44

- **upgraded to [Expo SDK 44](https://blog.expo.dev/expo-sdk-44-4c4b8306584a)**
  - replaced deprecated expo-constants with expo-device
  - wrapped NavigationContainer with GestureHandlerRootView
- removed Dev Tools menu when environment is not dev

### March 23, 2022; version: 0.0.43

- **upgraded to [Expo SDK 43](https://blog.expo.dev/expo-sdk-43-aa9b3c7d5541)**
  - React Native updated from 0.63.2 to 0.64.3
  - react and react-dom both updated from 16.13.1 to 17.0.1
  - replaced deprecated Appearance from react-native-appearance with Appearance from react-native
- included bookmarks when registering device with the PN service
- fixed image src and newline issues when extracting consumer information from the portal
- added icon to Home screen
- made tabs scroll page to top on press, and on homescreen when focussed
- added RefreshControl for products and bookmarks sync to Products and Bookmarks screens

### January 12, 2022; version: 0.0.42

- **upgraded to [Expo SDK 42](https://blog.expo.dev/expo-sdk-42-579aee2348b6)**
- fixed date sort order issue on Notifications screen
- added unread badge to Notifications bell icon on header
- added What's New? item to drawer
- added message types for notifications
- persisted notifications settings and added to state store

### December 17, 2021; version: 0.0.41

- **upgraded to [Expo SDK 41](https://blog.expo.dev/expo-sdk-41-12cc5232f2ef)**
  - React Native updated from 0.63 to 0.63.2
- updated terms screen

### December 9, 2021; version: 0.0.3

- **initial development**
- added user preference for en-CA/fr-CA
- removed react-native-svg
- upgraded to [React Navigation v5](https://reactnavigation.org/docs/upgrading-from-4.x)
- introduced cross platform Material Design UI toolkit [React Native Paper](https://reactnativepaper.com)

### March 10, 2021; version: 0.0.2

- **added starter**
  - this starter originally from [expo-multi-screen-starter](https://github.com/calebnance/expo-multi-screen-starter), by Caleb Nance
