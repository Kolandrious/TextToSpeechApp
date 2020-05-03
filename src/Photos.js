import React from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  PermissionsAndroid,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CameraRoll from '@react-native-community/cameraroll';

export default ({ navigation }) => {
  const [photos, setPhotos] = React.useState([]);
  const [cursor, setCursor] = React.useState({});
  const [permissions, setPermissions] = React.useState(false);
  const [isFetchingMore, setIsFetchingMore] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(true);
  const screenWidth = Dimensions.get('screen').width;

  useFocusEffect(
    React.useCallback(() => {
      let presses = 0;
      const onBackPress = () => {
        if (presses === 1) {
          return false;
        } else {
          presses += 1;
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const fetchInitialPhotos = React.useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await CameraRoll.getPhotos({
        first: 21,
        assetType: 'Photos',
      });
      setPhotos(response.edges);
      setCursor(response.page_info);
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetching(false);
    }
  }, []);

  const fetchPhotos = async newCursor => {
    try {
      setIsFetchingMore(true);
      const response = await CameraRoll.getPhotos({
        first: +newCursor + 21,
        assetType: 'Photos',
        after: `${newCursor}`,
      });
      setPhotos(lastPhotos => {
        if (lastPhotos[lastPhotos.length - 1].blank) lastPhotos.pop();
        response.edges.forEach(photo => lastPhotos.push(photo));
        if (response.page_info.has_next_page) {
          lastPhotos.push({ blank: true, node: { image: { uri: 'fake' } } });
        }
        return lastPhotos;
      });
      setCursor(response.page_info);
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const fetchMorePhotos = () => {
    if (!cursor.has_next_page || isFetchingMore) return;
    fetchPhotos(cursor.end_cursor);
  };

  React.useEffect(() => {
    const requestPermissions = async number => {
      try {
        const granted = await PermissionsAndroid.request(
          number === 1
            ? PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          if (number === 2) {
            setPermissions(true);
            fetchInitialPhotos();
          } else requestPermissions(2);
        } else setPermissions(false);
      } catch (e) {
        console.log('cant open android permissions dialog', e);
      }
    };

    requestPermissions(1);
  }, [fetchInitialPhotos]);

  if (!permissions) {
    return (
      <View>
        <Text>Калі ласка, надайце дазволы</Text>
      </View>
    );
  }

  const renderImage = ({ item: photo }) => {
    const onItemPress = () => {
      navigation.navigate('PhotoDetails', { uri: photo.node.image.uri });
    };
    const eachItemDimensions = (screenWidth - 10) / 3 - 10;

    if (photo.blank) {
      return (
        <View
          style={[
            styles.photoContainer,
            styles.center,
            { width: eachItemDimensions, height: eachItemDimensions },
          ]}
        >
          <ActivityIndicator size={eachItemDimensions / 2} />
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.photoContainer,
          { width: eachItemDimensions, height: eachItemDimensions },
        ]}
        onPress={onItemPress}
      >
        <Image style={styles.photo} source={{ uri: photo.node.image.uri }} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      {!!photos && !!photos.length && (
        <FlatList
          data={photos}
          keyExtractor={photo => photo.node.image.uri}
          renderItem={renderImage}
          numColumns={3}
          onEndReached={fetchMorePhotos}
          contentContainerStyle={styles.photosContainer}
          onRefresh={fetchInitialPhotos}
          refreshing={isFetching}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  photosContainer: {
    padding: 5,
  },
  photoContainer: {
    margin: 5,
    elevation: 4,
    borderRadius: 2,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    flex: 1,
  },
});
