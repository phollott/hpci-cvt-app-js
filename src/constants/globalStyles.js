import colors from './colors';
import fonts from './fonts';

// utility styles
// /////////////////////////////////////////////////////////////////////////////
export default {
  activeOpacity: 0.7,

  // containers
  // ///////////////////////////////////////////////////////////////////////////
  container: {
    dark: {
      backgroundColor: colors.darkHighlightColor,
      flex: 1
    },
    light: {
      backgroundColor: colors.white,
      flex: 1
    }
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 8
  },

  // navigation styles
  // ///////////////////////////////////////////////////////////////////////////
  headerTitleStyle: {
    flex: 1,
    textAlign: 'center'
  },
  headerBaseEnds: {
    flex: 1,
    justifyContent: 'center'
  },

  // tint color
  // ///////////////////////////////////////////////////////////////////////////
  tintColor: {
    active: {
      light: colors.white,
      dark: colors.white
    },
    inactive: {
      light: colors.white50,
      dark: colors.white50
    }
  },

  // button
  // ///////////////////////////////////////////////////////////////////////////
  btn: {
    alignItems: 'center',
    backgroundColor: colors.darkColor,
    borderColor: colors.darkColor,
    borderWidth: 1,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
    paddingVertical: 8
  },
  btnText: {
    color: colors.white,
    textAlign: 'center'
  },

  // text
  // ///////////////////////////////////////////////////////////////////////////
  text: {
    dark: {
      color: colors.white
    },
    light: {
      color: colors.darkColor
    }
  },
  textPacifico: {
    fontFamily: fonts.pacifico,
    fontSize: 20
  },

  // spacers
  // ///////////////////////////////////////////////////////////////////////////
  spacer8: {
    height: 8,
    width: '100%'
  },
  spacer16: {
    height: 16,
    width: '100%'
  },
  spacer32: {
    height: 32,
    width: '100%'
  },
  spacer48: {
    height: 48,
    width: '100%'
  },
  spacer64: {
    height: 64,
    width: '100%'
  }
};
