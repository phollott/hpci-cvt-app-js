import { Alert as AlertRN } from 'react-native';
import { t } from 'i18n-js';

const Alert = (text) => {
  AlertRN.alert(t('common.alert.title'), text, [
    { text: t('common.alert.button.ok'), onPress: () => {} }
  ]);
};

export default Alert;
