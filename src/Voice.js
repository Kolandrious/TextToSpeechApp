import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  PermissionsAndroid,
  Button,
  ScrollView,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import RNSound from 'react-native-sound';
import { languages } from './constants';

RNSound.setCategory('Playback');

const serializeObject = object =>
  Object.entries(object)
    .map(
      ([key, value]) =>
        encodeURIComponent(key) + '=' + encodeURIComponent(value),
    )
    .join('&');

export default ({ navigation, route }) => {
  const [voice, setVoice] = React.useState(
    `Alesia${languages[route.params.language]}`,
  );
  const [permissions, setPermissions] = React.useState(false);
  const [player, setPlayer] = React.useState(null);

  const fetchVoice = React.useCallback(
    async (text, language, voiceStyle) => {
      navigation.setParams({
        title: 'Загружаецца',
      });
      try {
        const speechResponse = await axios.post(
          'https://corpus.by/TextToSpeechSynthesizer/api.php',
          serializeObject({
            text,
            language,
            voice: voiceStyle,
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        );
        const audioFile = await RNFetchBlob.config({
          fileCache: true,
          path: RNFetchBlob.fs.dirs.CacheDir + '/voice.wav',
        }).fetch('GET', speechResponse.data.audio);
        playAudio(audioFile.path());
      } catch (err) {
      } finally {
        navigation.setParams({
          title: 'Вынік',
        });
      }
    },
    [playAudio, navigation],
  );

  React.useEffect(() => {
    return () => {
      if (player) {
        player.stop();
        player.release();
      }
    };
  }, [player]);

  React.useEffect(() => {
    const requestPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissions(true);
        } else setPermissions(false);
      } catch (e) {
        console.log('cant open android permissions dialog', e);
      }
    };

    requestPermissions();
  }, []);

  React.useEffect(() => {
    if (voice) fetchVoice(route.params.text, route.params.language, voice);
  }, [fetchVoice, route.params.language, route.params.text, voice]);

  const playAudio = React.useCallback(
    audioToPlay => {
      if (audioToPlay) {
        const Audio = new RNSound(audioToPlay, RNSound.CACHES, err => {
          if (err) {
            console.log('Failed to play file', err);
            return;
          }
          if (player) {
            player.stop();
          }
          setPlayer(Audio);
          Audio.play(success => {
            if (success) {
              Audio.release();
              setPlayer(null);
              setVoice('');
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        });
        return Audio;
      }
    },
    [player],
  );

  const changeVoice = newVoice => {
    if (player) player.stop();
    setVoice(newVoice);
  };

  if (!permissions) {
    return (
      <View>
        <Text>Калі ласка, надайце дазволы</Text>
      </View>
    );
  }

  const language = route.params.language;
  const names = {
    Alesia: `Alesia${languages[language]}`,
    'Alesia Dictation': `Alesia${languages[language]} (dictation mode)`,
    Boris: `Boris${languages[language]}`,
    'Boris Dictation': `Boris${languages[language]} (dictation mode)`,
    'Boris High': `Boris${languages[language]}High`,
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.text}>{route.params.text}</Text>
        {Object.entries(names).map(([key, value]) => (
          <ChangeVoiceButton
            key={key}
            title={key}
            onChange={changeVoice}
            voice={value}
            currentVoice={voice}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const ChangeVoiceButton = ({ title, voice, currentVoice, onChange }) => (
  <View style={styles.buttonContainer}>
    <Button
      color={currentVoice === voice ? '#009688' : undefined}
      title={title}
      onPress={() => onChange(voice)}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    padding: 5,
  },
  text: {
    fontSize: 18,
  },
  buttonContainer: {
    marginVertical: 5,
  },
});
