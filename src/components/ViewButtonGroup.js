import * as React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, gStyle } from '../constants';

const ViewButtonGroup = ({ buttons, onPress, selectedIndex, accessible }) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonGroupContainer}>
        {buttons.map((button, index) => (
          <View key={'viewbutton'.concat(index)} style={styles.buttonContainer}>
            <TouchableOpacity
              key={'button'.concat(index)}
              onPress={() => {
                onPress(index);
              }}
              selectedIndex={selectedIndex}
              style={
                index === selectedIndex
                  ? [styles.button, styles.activeButton]
                  : styles.button
              }
              accessible={accessible}
              activeOpacity={gStyle.activeOpacity}
            >
              <Text
                style={
                  index === selectedIndex
                    ? styles.activeButtonText
                    : styles.buttonText
                }
              >
                {button}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 8,
    marginBottom: 4
  },
  buttonGroupContainer: {
    flexDirection: 'row',
    width: '100%'
  },
  buttonContainer: {
    flex: 1,
    borderRadius: 0
  },
  button: {
    backgroundColor: colors.white,
    height: 30,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeButton: {
    backgroundColor: colors.darkColor
  },
  buttonText: {
    color: colors.grey,
    fontSize: 16
  },
  activeButtonText: {
    color: colors.white,
    fontSize: 16
  }
});

ViewButtonGroup.defaultProps = {
  selectedIndex: null,
  accessible: true
};

ViewButtonGroup.propTypes = {
  // required
  buttons: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,

  // optional
  selectedIndex: PropTypes.number,
  accessible: PropTypes.bool
};

export default ViewButtonGroup;
