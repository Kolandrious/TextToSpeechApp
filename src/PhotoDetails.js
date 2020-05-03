import React from 'react';
import { SafeAreaView, StyleSheet, View, Button, Image } from 'react-native';
import ImgToBase64 from 'react-native-image-base64';
import { GCLOUD_API_KEY } from 'react-native-dotenv';
import axios from 'axios';

export default ({ route, navigation }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const request = async fileUri => {
    try {
      const base64 = await new Promise((resolve, reject) => {
        setTimeout(() => {
          ImgToBase64.getBase64String(fileUri)
            .then(resolve)
            .catch(reject);
        }, 0);
      });
      const { data: visionResponse } = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${GCLOUD_API_KEY}`,
        {
          requests: [
            {
              image: { content: base64 },
              features: [{ type: 'TEXT_DETECTION' }],
            },
          ],
        },
      );
      const vision = visionResponse.responses[0].textAnnotations[0];
      const text = vision.description;
      const language = vision.locale;

      navigation.replace('Voice', {
        language,
        text,
      });
    } catch (err) {
      console.log('Failed to voice image', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePress = async () => {
    setIsLoading(true);
    request(route.params.uri);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={{ uri: route.params.uri }}
      />
      <View style={styles.buttonContainer}>
        <Button
          disabled={isLoading}
          title={isLoading ? 'Загружаецца...' : 'Агучыць'}
          onPress={handlePress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
  },
  image: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    padding: 10,
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
