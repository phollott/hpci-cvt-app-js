import * as React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { gStyle } from '../constants';
//import { Image } from 'react-native';
//import { images } from '../constants';

// components
import Touch from '../components/Touch';

//const headerImage = __DEV__ ? 'rabbitDev' : 'rabbitProd';

const SettingsScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView
      contentContainerStyle={gStyle.contentContainer}
      style={gStyle.container[theme]}
    >
      <Text style={gStyle.text[theme]}>Settings content area</Text>

      <View style={gStyle.spacer16} />

      <Touch
         onPress={() => screenProps.updateTheme('light')}
         text="Light theme"
      />
      <Touch
        onPress={() => screenProps.updateTheme('dark')}
        text="Dark theme"
      />

   </ScrollView>
  );
};

// Note: migrate header* props to SettingsStack options if enabling Settings tab:
// SettingsScreen.navigationOptions = ({ theme }) => {
//   return {
//     headerLeft: () => (
//       <View style={[gStyle.headerBaseEnds, { paddingLeft: 16 }]}>
//         <Text style={gStyle.text[theme]}>left</Text>
//       </View>
//     ),
//     headerRight: () => (
//       <View style={[gStyle.headerBaseEnds, { paddingRight: 16 }]}>
//         <Text style={gStyle.text[theme]}>right</Text>
//       </View>
//     ),
//     headerTitle: () => (
//       <View style={{ flex: 1 }}>
//         <Image
//           style={{ alignSelf: 'center', height: 40, width: 40 }}
//           source={images[headerImage]}
//         />
//       </View>
//     )
//   };
// };

/*
// shoutout @notbrent: https://snack.expo.io/H105kxsG7
const shouldShowBackButton = stackRouteNavigation => {
  const parent = stackRouteNavigation.dangerouslyGetParent();
  return parent.state.routes.indexOf(stackRouteNavigation.state) > 0;
};

SettingsScreen.navigationOptions = ({ navigation }) => ({

headerLeft: !shouldShowBackButton(navigation) ? (
  <View style={{ flex: 1 }}>
    <Text>left</Text>
  </View>
) : null,
*/

export default SettingsScreen;
