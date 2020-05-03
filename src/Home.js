import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Button,
  View,
  ScrollView,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { INACTIVE_BUTTON_COLOR } from './constants';

export default ({ navigation }) => {
  const [language, setLanguage] = React.useState('');

  useFocusEffect(
    React.useCallback(() => {
      let presses = 0;
      const onBackPress = () => {
        if (presses === 1) {
          console.log('EXIT');
          return false;
        } else {
          if (language) {
            setLanguage('');
          } else {
            presses += 1;
          }
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [language]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.textContainer}>
          <Text>
            Привет, это приложение, которое распознаёт текст и озвучивает его.
            Можно проводить озвучивание по фотографии, или же сделать фотографию
            прямо здесь. Для начала, выбери язык для текста, а дальше ты
            разберёшься :)
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <View style={styles.button}>
            <Button
              color={language && language !== 'en' && INACTIVE_BUTTON_COLOR}
              onPress={() => setLanguage('en')}
              title="English"
            />
          </View>
          <View style={styles.button}>
            <Button
              color={language && language !== 'ru' && INACTIVE_BUTTON_COLOR}
              onPress={() => setLanguage('ru')}
              title="Русский"
            />
          </View>
          <View style={styles.button}>
            <Button
              color={language && language !== 'be' && INACTIVE_BUTTON_COLOR}
              onPress={() => setLanguage('be')}
              title="Беларуская мова"
            />
          </View>
          {!!language && (
            <View style={styles.button}>
              <Button
                onPress={() => navigation.navigate('Photos', { language })}
                title="GO"
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  textContainer: {
    marginBottom: 20,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    marginBottom: 10,
  },
  buttonInactive: {
    backgroundColor: 'blue',
  },
});
