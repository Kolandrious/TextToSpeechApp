import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid,
  Button,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

export default ({ route }) => {
  const cameraRef = React.useRef(null);
  const androidCameraPermissionOptions = {
    title: 'Permission to use camera',
    message: 'Please allow camera usage if you want to scan taken photo',
    buttonPositive: 'OK',
  };

  const onGrantAccess = async () => {
    try {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      await cameraRef.current.refreshAuthorizationStatus();
    } catch (e) {
      console.log('cant open android permissions dialog', e);
    }
  };

  const renderGrantAcess = (
    <View>
      <Text>
        Вы павінны дазволіць выкарыстанне камеры, калі вы хочаце агучваць
        зробленыя фатаграфіі.
      </Text>
      <Button title="Allow Camera access" onPress={onGrantAccess} />
    </View>
  );

  return (
    <RNCamera
      ref={cameraRef}
      style={styles.camera}
      type={RNCamera.Constants.Type.back}
      flashMode={RNCamera.Constants.FlashMode.on}
      captureAudio={false}
      androidCameraPermissionOptions={androidCameraPermissionOptions}
      notAuthorizedView={renderGrantAcess}
    >
      <Text style={styles.text}>Camera {route.params.language}</Text>
    </RNCamera>
  );
};

const styles = StyleSheet.create({
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    color: 'white',
  },
});
