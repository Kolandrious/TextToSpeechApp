import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  ImageBackground,
} from 'react-native';

export default ({ route, navigation }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const handlePress = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        resizeMode="contain"
        style={[StyleSheet.absoluteFillObject, { justifyContent: 'flex-end' }]}
        source={{ uri: route.params.uri }}
      >
        <View style={styles.buttonContainer}>
          <Button
            disabled={isLoading}
            title={isLoading ? 'Loading...' : 'Voice'}
            onPress={handlePress}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  buttonContainer: {
    padding: 10,
    marginBottom: 20,
  },
});
