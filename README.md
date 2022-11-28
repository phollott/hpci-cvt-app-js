# HC CVT App


[![made with expo](https://img.shields.io/badge/MADE%20WITH%20EXPO-000.svg?style=for-the-badge&logo=expo&labelColor=4630eb&logoWidth=20)](https://github.com/expo/expo) [![supports iOS and Android](https://img.shields.io/badge/Platforms-Native-4630EB.svg?style=for-the-badge&logo=EXPO&labelColor=000&logoColor=fff)](https://github.com/expo/expo)

### Technical Notes

- Expo SDK 46
- React Native 0.68.2
- React Navigation v5
- React Native Paper v4
- React Redux v7
- Async Storage v1
- Expo Notifications v0
- Node: >=16.14.2
- Yarn: >=1.22.18

## Table of Contents

- [install](#install)
- [development on a physical device](#development-on-a-physical-device)
- [linting](#linting)
- [helpful links](#helpful-links)
- [device learnings](#device-learnings)
- [release notes](#release-notes)

## install

First, make sure you have Expo CLI installed: 

Install: 

- `npm install -g expo-cli`
- `yarn` or `yarn install`

Create .env file: copy contents of .env.template and set variables (create in same location)

Run project locally: `npx expo start` or `npx expo start --tunnel`

## development on a physical device

- first, your machine and physical device should be on the same wifi connection
- make sure you have Expo CLI and EAS CLI installed globally, if not run:
  - `npm install -g expo-cli`
  - `npm install -g eas-cli`
- then configure .env: see .env.template
- then navigate to this project's directory on your machine and run:
  - `npx expo start`
- now download the Expo Client app on your preferred physical device:
  - **Android:** [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - **Apple:** [App Store](https://itunes.apple.com/us/app/expo-client/id982107779)
- scan the QR code generated when this project build started (expo start)
  - **android users:** the QR scanner is built within the Expo Client app!
  - **ios 11 and later:** you can open your camera app to scan the QR code, apple made the Expo folks remove the QR scanner from the app for some reason...
  - **ios 10 and below:** work around to [get expo running on older iOS devices](https://blog.calebnance.com/expo/getting-expo-to-work-on-older-iphones-with-no-qr-support.html)
- having issues? check the [installation page](https://docs.expo.dev/get-started/installation/) for any pitfalls you may have.

## linting

- run: `npm run lint` or `yarn lint` for a list of linting warnings/error in cli
- prettier and airbnb config
- make sure you have prettier package installed:
  - [prettier for atom](https://atom.io/packages/prettier-atom)
  - [prettier for vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- then make sure to enable these options (packages → prettier):
  - eslint integration
  - stylelint integration
- be aware of the `.prettierignore` file

## helpful links

- [using nvm](https://davidwalsh.name/nvm)
- [setup prettier/eslint within project](https://blog.echobind.com/integrating-prettier-eslint-airbnb-style-guide-in-vscode-47f07b5d7d6a)

## device learnings

- **ios:** The notch on iPhoneX, iPhoneXs, iPhoneXr, iPhoneXs Max is **30pt** from top

## release notes

**HC CVT App - Update 0.0.46**

### _steps to update local dev env_
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
````

### November 28, 2022; version: 0.0.46

- **upgraded expo sdk from 45 to 46 (August)**
  - React Native updated from 0.68.2 to 0.69.6
  - react and react-dom both updated from 17.0.2 to 18.0.0
  - See https://blog.expo.dev/expo-sdk-46-c2a1655f63f7, note:
````
- To use the new local CLI: run npx expo or yarn expo in your project directory, eg: npx expo start. The local CLI will automatically be invoked by scripts in your package.json, but otherwise you need to prefix it with npx.
- If you run expo start in your project, the global CLI will be used.
- If you run npx expo start, the local CLI will be used.
- To explicitly invoke the legacy globally installed CLI: use expo-cli instead of expo, eg: expo-cli publish.
- Global Expo CLI is still required for expo upgrade and expo doctor: these commands haven’t yet been migrated to standalone packages, they are up next. Invoke them with expo-cli upgrade and expo-cli doctor.
````
- minor accessiblity/usability improvements

### November 9, 2022; version: 0.0.45

- **upgraded expo sdk from 44 to 45 (May)**
  - React Native updated from 0.64.3 to 0.68.2
  - react and react-dom both updated from 17.0.1 to 17.0.2

### May 3, 2022; version: 0.0.44, build 2

- **migrated from Expo classic build to EAS build**
  - added build profiles (eas.json)
  - added publish and build workflows (yml)
  - wrapped MenuDrawer with SafeAreaProvider to resolve padding issue for android
  - installed expo-status-bar and upgraded expo-updates to resolve status bar issues for android

### April 11, 2022; version: 0.0.44

- **upgraded expo sdk from 43 to 44 (Dec)**
  - replaced deprecated expo-constants with expo-device
  - wrapped NavigationContainer with GestureHandlerRootView
- removed Dev Tools menu when environment is not dev

### March 23, 2022; version: 0.0.43

- **upgraded expo sdk from 42 to 43**
  - React Native updated from 0.63.2 to 0.64.3
  - react and react-dom both updated from 16.13.1 to 17.0.1
  - replaced deprecated Appearance from react-native-appearance with Appearance from react-native
- included bookmarks when registering device with the PN service
- fixed image src and newline issues when extracting consumer information from the portal
- added icon to Home screen
- made tabs scroll page to top on press, and on homescreen when focussed
- added RefreshControl for products and bookmarks sync to Products and Bookmarks screens

### January 12, 2022; version: 0.0.42

- **upgraded expo sdk from 41 to 42**
- fixed date sort order issue on Notifications screen
- added unread badge to Notifications bell icon on header
- added What's New? item to drawer
- added message types for notifications
- persisted notifications settings and added to state store

### December 17, 2021; version: 0.0.41

- **upgraded expo sdk from 40 to 41**
  - React Native updated from 0.63 to 0.63.2
- updated terms screen

### December 9, 2021; version: 0.0.3

- **initial development**
- added user preference for en-CA/fr-CA
- removed react-native-svg
- upgraded to [React Navigation v5](https://reactnavigation.org/docs/upgrading-from-4.x/)
- introduced cross platform Material Design UI toolkit [React Native Paper](https://reactnativepaper.com/)

### March 10, 2021; version: 0.0.2

- **added starter**
  - this starter originally from [expo-multi-screen-starter](https://github.com/calebnance/expo-multi-screen-starter), by Caleb Nance
