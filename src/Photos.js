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
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';

export default ({ route, navigation }) => {
  const [photos, setPhotos] = React.useState([]);
  const [cursor, setCursor] = React.useState({});
  const [permissions, setPermissions] = React.useState(false);
  const [isFetchingMore, setIsFetchingMore] = React.useState(false);
  const [isFetching, setIsFetching] = React.useState(true);
  const [screenWidth, setScreenWidth] = React.useState(375);

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
      setPhotos(lastPhotos => [...lastPhotos, ...response.edges]);
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
    const requestPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissions(true);
          fetchInitialPhotos();
        } else setPermissions(false);
      } catch (e) {
        console.log('cant open android permissions dialog', e);
      }
    };

    requestPermissions();
  }, [fetchInitialPhotos]);

  if (!permissions) {
    return (
      <View>
        <Text>Please grant permisisons</Text>
      </View>
    );
  }

  const renderImage = ({ item: photo }) => {
    const onItemPress = () => {
      navigation.navigate('PhotoDetails', { uri: photo.node.image.uri });
    };
    const eachItemDimensions = (screenWidth - 10) / 3 - 10;

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
    <SafeAreaView
      onLayout={({
        nativeEvent: {
          layout: { width },
        },
      }) => setScreenWidth(width)}
    >
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
    // flex: 1,
    margin: 5,
  },
  photo: {
    flex: 1,
    // height: 100,
    // width: 100,
  },
});
